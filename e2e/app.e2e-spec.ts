import { CotuongPage } from './app.po';

describe('cotuong App', function() {
  let page: CotuongPage;

  beforeEach(() => {
    page = new CotuongPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
