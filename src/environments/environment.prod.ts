export const environment = {
  production: true,
  chess: {
    layout: {
      padding: 30,
      cell: 50,
      chessRadius: 20,
      fontSize: 36,
      width: 400,
      height: 450,
      offsetWidth: 460,
      offsetHeight: 510
    },
    style: {
      board: {
        border: '#630',
        background: '#fed',
        font: '36px 隶书'
      },
      piece: [{
        border: '#fa8',
        background: '#fc9',
        font: '24px 隶书',
        fontSize: 24,
        fontColor: '#c00'
      }, {
        border: '#fa8',
        background: '#fc9',
        font: '24px 隶书',
        fontSize: 24,
        fontColor: '#090'
      }]
    }
  }
};
