const assert = require("assert");
const {
  generateResult,
  filterNumberOfLines,
  filterNumberOfChars,
  selectOperationType,
  isContextTail
} = require("../src/fileUtils.js");

const readFileSync = function(expectedFiles, expectedEncoding) {
  return function(actualFilePath, actualEncoding) {
    if (expectedEncoding === actualEncoding) {
      return expectedFiles[actualFilePath];
    }
  };
};

const existsSync = function(fileNames) {
  return function(fileName) {
    return fileNames.includes(fileName);
  };
}

describe("filterNumberOfLines", function() {
  let file = "node ./head.js -n5 file1\n";
  file += "node ./head.js -n 5 file1\n";
  file += "node ./head.js -5 file1\n";
  file += "node ./head.js file1 file2\n";
  file += "node ./head.js -n 5 file1 file2\n";
  file += "node ./head.js -n5 file1 file2\n";
  file += "node ./head.js -5 file1 file2\n";
  file += "node ./head.js -c5 file1\n";
  file += "node ./head.js -c 5 file1\n";
  file += "node ./head.js -c5 file1 file2\n";
  file += "node ./head.js -c 5 file1 file2\n";

  it("should return 10 lines of the file if num of line is not specified ", function() {
    let expectedOutput = "node ./head.js -n5 file1\n";
    expectedOutput += "node ./head.js -n 5 file1\n";
    expectedOutput += "node ./head.js -5 file1\n";
    expectedOutput += "node ./head.js file1 file2\n";
    expectedOutput += "node ./head.js -n 5 file1 file2\n";
    expectedOutput += "node ./head.js -n5 file1 file2\n";
    expectedOutput += "node ./head.js -5 file1 file2\n";
    expectedOutput += "node ./head.js -c5 file1\n";
    expectedOutput += "node ./head.js -c 5 file1\n";
    expectedOutput += "node ./head.js -c5 file1 file2";
    let actualOutput = filterNumberOfLines(file,10);
    assert.deepEqual(actualOutput, expectedOutput);
  });

  let expectedOutput = "node ./head.js -n5 file1\n";
  expectedOutput += "node ./head.js -n 5 file1\n";
  expectedOutput += "node ./head.js -5 file1\n";
  expectedOutput += "node ./head.js file1 file2\n";
  expectedOutput += "node ./head.js -n 5 file1 file2";
  it("should return specified no of lines if num of lines is specified", function() {
    let actualOutput = filterNumberOfLines(file, 5);
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return empty string for 0 num of line", function() {
    let actualOutput = filterNumberOfLines(file, 0);
    assert.deepEqual(actualOutput, "");
  });

  it("should return specified number of lines from last", function() {
    let actualOutput = filterNumberOfLines(file, 1, "tail");
    let expectedOutput = "node ./head.js -c 5 file1 file2\n";
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("filterNumberOfChars", function() {
  it("should give specified no of chars", function() {
    let file = "node ./head.js -n5 file1\n";
    let actualOutput = filterNumberOfChars(file, 5);
    let expectedOutput = "node ";
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should give specified no of chars from last", function() {
    let file = "node ./head.js -n5 file1\n";
    let actualOutput = filterNumberOfChars(file, 5, "tail");
    let expectedOutput = "ile1\n";
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("selectOperationType", function() {
  let file = "node ./head.js -n5 file1\n";
  file += "node ./head.js -n 5 file1\n";
  file += "node ./head.js -5 file1\n";
  file += "node ./head.js file1 file2\n";
  file += "node ./head.js -n 5 file1 file2\n";
  file += "node ./head.js -n5 file1 file2\n";
  file += "node ./head.js -5 file1 file2\n";
  file += "node ./head.js -c5 file1\n";
  file += "node ./head.js -c 5 file1\n";
  file += "node ./head.js -c5 file1 file2\n";
  file += "node ./head.js -c 5 file1 file2\n";
  it("should return specified number of lines if option is n", function() {
    let expectedOutput = "node ./head.js -n5 file1\n";
    expectedOutput += "node ./head.js -n 5 file1\n";
    expectedOutput += "node ./head.js -5 file1\n";
    expectedOutput += "node ./head.js file1 file2\n";
    expectedOutput += "node ./head.js -n 5 file1 file2";
    let actualOutput = selectOperationType(file, 5, "n");
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return specified number of characters if option is c", function() {
    let expectedOutput = "node ";
    let actualOutput = selectOperationType(file, 5, "c");
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return 10 lines if option and number nothing is specified", function() {
    let expectedOutput = "node ./head.js -n5 file1\n";
    expectedOutput += "node ./head.js -n 5 file1\n";
    expectedOutput += "node ./head.js -5 file1\n";
    expectedOutput += "node ./head.js file1 file2\n";
    expectedOutput += "node ./head.js -n 5 file1 file2\n";
    expectedOutput += "node ./head.js -n5 file1 file2\n";
    expectedOutput += "node ./head.js -5 file1 file2\n";
    expectedOutput += "node ./head.js -c5 file1\n";
    expectedOutput += "node ./head.js -c 5 file1\n";
    expectedOutput += "node ./head.js -c5 file1 file2";
    let actualOutput = selectOperationType(file,10);
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("generateResult", function() {
  describe("for head", function() {
    describe("return error", function() {
      let files = {};
      files["file1"] = "expected";
      let fs = {
        readFileSync: readFileSync(files, "utf-8"),
        existsSync: existsSync(["file1"])
      };

      it("should return an error message if count is invalid", function() {
        let expectedOutput = "head: illegal line count -- -1";
        let input = { option: "n", count: "-1", files: ["ankon"], context: "head" };
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });
    });

    describe("test generateResult function using mock existsSync", function() {
      let files = {};
      files["file1"] = "expected";
      let fs = {
        readFileSync: readFileSync(files, "utf-8"),
        existsSync: existsSync(["file1"])
      };

      it("should return error message if the file doesn't exists", function() {
        let expectedOutput = "head: file2: No such file or directory";
        let input = { option: "n", count: "3", files: ["file2"], context: "head" };
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });

      it("should return the content of the given files object", function() {
        let expectedOutput = "expected";
        let input = { option: "n", count: "3", files: ["file1"], context: "head" };
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });
    });

    describe("test genearateResult function using mock readFileSync", function() {
      let files = {};
      files["file1"] = "expected";
      let fs = {
        readFileSync: readFileSync(files, "utf-8"),
        existsSync: existsSync(["file1",'file2'])
      };

      it("should return contents of the file given", function() {
        let expectedOutput = "expected";
        let input = { option: "n", count: "3", files: ['file1'], context: "head" };
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });

      it("should return contents in formatted way for multiple files", function() {
        files["file2"] = 'expected1';
        let expectedOutput = "==> file1 <==\nexpected\n\n==> file2 <==\nexpected1";
        let input = { option: "n", count: "3", files: ['file1','file2'], context: "head" };
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });
    });
  });

  describe("for tail", function() {
    describe("return error", function() {
      let files = {};
      files["file1"] = "expected";
      let fs = {
        readFileSync: readFileSync(files, "utf-8"),
        existsSync: existsSync(["file1"])
      };

      it("should return an error message if offset is invalid", function() {
        let expectedOutput = "tail: illegal offset -- -1";
        let input = { option: "n", count: "-1", files: ["ankon"], context: "tail"};
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });
    });

    describe("test generateResult function using mock existsSync", function() {
      let files = {};
      files["file1"] = "expected";
      let fs = {
        readFileSync: readFileSync(files, "utf-8"),
        existsSync: existsSync(["file1"])
      };

      it("should return error message if the file doesn't exists", function() {
        let expectedOutput = "tail: file2: No such file or directory";
        let input = { option: "n", count: "3", files: ['file2'], context: "tail" };
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });

      it("should return the content of the given files object", function() {
        let expectedOutput = "expected\n";
        let input = { option: "n", count: "3", files: ['file1'], context: "tail" };
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });
    });
    describe("test generateResult function using mock readFileSync", function() {
      let files = {};
      files["file1"] = "expected";
      let fs = {
        readFileSync: readFileSync(files, "utf-8"),
        existsSync: existsSync(["file1",'file2'])
      };

      it("should return contents of the file given", function() {
        let expectedOutput = "expected\n";
        let input = { option: "n", count: "3", files: ['file1'], context: "tail" };
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });

      it("should return contents in formatted way for multiple files", function() {
        files['file2']='expected1';
        let expectedOutput = "==> file1 <==\nexpected\n\n\n==> file2 <==\nexpected1\n";
        let input = { option: "n", count: "3", files: ['file1', 'file2'], context: "tail" };
        let actualOutput = generateResult(fs, input);
        assert.deepEqual(actualOutput, expectedOutput);
      });
    });
  });
});

describe("isContextTail", () => {
  it("should return false if the context is head", () => {
    assert.deepEqual(isContextTail("head"), false);
  });

  it("should return true if the context is tail", () => {
    assert.deepEqual(isContextTail("tail"), true);
  });
});