const parser = function(args,headOrTail) {
  let parsedInput = {
    option: "n",
    count: 10,
    filePaths: args.slice(0),
    headOrTail: ""
  };

 
  parsedInput.headOrTail = headOrTail;
  const optionCandidate = args[0];
  const filePaths = args.slice(1);

  if(!isOptionSpecified(optionCandidate)){
    return getDefaultArgs(args,headOrTail);
  }

  if (isOnlyOption(optionCandidate)) {
    let filePaths = args.slice(2);
    parsedInput.option = optionCandidate[1];
    parsedInput.count = args[1];
    parsedInput.filePaths = filePaths;
  }
  if (isOnlyValue(optionCandidate)) {
    parsedInput.count = optionCandidate.slice(1);
    parsedInput.filePaths = filePaths;
  }
  if (isOptionAndValue(optionCandidate)) {
    parsedInput.option = optionCandidate[1];
    parsedInput.count = optionCandidate.slice(2);
    parsedInput.filePaths = filePaths;
  }
  return parsedInput;
};

const getDefaultArgs = (args, headOrTail) => {
  return {
    option: "n",
    count: 10,
    filePaths: args.slice(0),
    headOrTail : headOrTail
  };
}
const isOptionSpecified = optionCandidate => {
  return optionCandidate.startsWith('-') && optionCandidate.length > 1;
}

const isOnlyOption = function(args) {
  return /^-[a-z]$/.test(args);
};

const isOnlyValue = args => {
  return isFinite(args[1]);
};
const isOptionAndValue = args => {
  return args.length > 2;
};

const generateHeader = function(filePath) {
  return "==> " + filePath + " <==\n";
};

const addHeader = function(filePaths, filePath, result) {
  if (filePaths.length > 1) {
    return generateHeader(filePath) + result;
  }
  return result;
};

module.exports = { 
  isOnlyValue, 
  isOnlyOption, 
  isOptionAndValue, 
  parser,
  generateHeader,
  addHeader
 }