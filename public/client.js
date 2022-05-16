$(document).ready(() => {
  const socket = io()

  socket.on('new message', (data) => {
    console.log(data)

    const message = $('<p>').text(data.message)

    $('#historico_mensagens').append(message)
  })

  $('#chat').submit(() => {
    const message = $('#texto_mensagens')

    socket.emit('new message', message.val())

    message.val('')

    return false
  })
})
