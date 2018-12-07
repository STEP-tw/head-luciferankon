const { errorCheck } = require('./errorLib.js');

const generateResult = function(fileSystem, arrangedInputs) {
  let { type, range, files } = arrangedInputs;
  let error = errorCheck(type, range, files);
  if (error) {
    return error;
  }
  const validateFile = formatOutputOfFile.bind(
    null,
    fileSystem,
    arrangedInputs
  );
  return files.map(validateFile).join('\n\n');
};

const formatOutputOfFile = function(
  { readFileSync, existsSync, lstatSync },
  { type, range, files },
  file
) {
  if (!existsSync(file)) {
    return 'head: ' + file + ': No such file or directory';
  }
  if (!lstatSync(file).isFile()) {
    return 'head: Error reading ' + file;
  }
  let fileName = '==> ' + file + ' <==\n';
  let fileData = readFileSync(file, 'utf-8');
  let result = selectOperationType(fileData, range, type);
  return addHeader(files, fileName, result);
};

const addHeader = function(files, fileName, result) {
  if (files.length > 1) {
    return fileName + result;
  }
  return result;
};

const filterNumOfLine = function(file, num = 10) {
  return file
    .split('\n')
    .slice(0, num)
    .join('\n');
};

const filterNumOfChar = function(file, num) {
  return file.slice(0, num);
};

const selectOperationType = function(file, num, type = 'n') {
  let opeartion = {
    n: filterNumOfLine,
    c: filterNumOfChar
  };
  return opeartion[type](file, num);
};

exports.generateResult = generateResult;
exports.filterNumOfLine = filterNumOfLine;
exports.filterNumOfChar = filterNumOfChar;
exports.selectOperationType = selectOperationType;
