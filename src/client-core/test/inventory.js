var
  describe = describe || function() {},
  it = it || function() {},
  expect = expect || function() {};

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});