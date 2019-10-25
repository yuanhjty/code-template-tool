import ___ClassName___ from '../../src/___ClassName___';

let chain = null;

describe.only('___ClassName___', () => {
  beforeEach(() => {
    chain = new ___ClassName___(_START_, ___interfaceStubs___);
  });
  it('chain is not null', () => {
    expect(chain).not.toBeNull();
  });
});
