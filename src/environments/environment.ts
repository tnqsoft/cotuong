// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
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
        border: '#999',
        background: '#fff',
        font: '36px 隶书'
      },
      piece: [{
        border: '#000',
        background: '#fff',
        font: '24px 隶书',
        fontSize: 24,
        fontColor: '#000'
      }, {
        border: '#000',
        background: '#000',
        font: '24px 隶书',
        fontSize: 24,
        fontColor: '#fff'
      }]
    }
  }
};
