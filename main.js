document.addEventListener('DOMContentLoaded', event => {
  const button = document.getElementById('connectButton')
  let device

  button.addEventListener('click', async (e) => {
    try {
      if (button.innerHTML === 'Disconnect') {
        device.gatt.disconnect()
        button.innerHTML = 'Connect'
        return
      }
      document.getElementById('p1').innerHTML = 'Connecting'
      console.log('Requesting Bluetooth Device...')
      device = await navigator.bluetooth.requestDevice({
        filters: [{
          namePrefix: 'Pixl.js'
        }],
        optionalServices: ['environmental_sensing']
      })

      device.addEventListener('gattserverdisconnected', onDisconnected)

      console.log('Connecting to GATT Server...')
      const server = await device.gatt.connect()
      button.innerHTML = 'Disconnect'

      console.log('Getting Environmental Sensing Service...')
      const service = await server.getPrimaryService('environmental_sensing')

      console.log('Getting Temperature Characteristic...')
      const characteristic = await service.getCharacteristic('temperature')

      console.log('Reading temperature...')
      const value = await characteristic.readValue()
      const temp = value.getUint16(0, true) / 100

      console.log('Temperature is ' + temp)
      document.getElementById('p1').innerHTML = temp

      await characteristic.startNotifications()

      console.log('Notifications started')
      characteristic.addEventListener('characteristicvaluechanged', handleNotifications)
    } catch (error) {
      console.log('Argh! ' + error)
      document.getElementById('p1').innerHTML = error
      button.innerHTML = 'Connect'
    }
  })

  function handleNotifications (event) {
    const value = event.target.value
    const temp = value.getUint16(0, true) / 100

    console.log('Temperature is now ' + temp)
    document.getElementById('p1').innerHTML = temp
  }

  function onDisconnected () {
    console.log('Disconnected.')
    button.innerHTML = 'Connect'
    document.getElementById('p1').innerHTML = 'Disconnected'
  }
})
