function separateOptionsWithArguments(inputString) {
    const optionRegex = /--([a-zA-Z_]+)\s*((?:[<>]=?)?\s*[0-9.]+|"[^"]+")/g;
    const options = {};
  
    let match;
    while ((match = optionRegex.exec(inputString)) !== null) {
      const optionName = match[1];
      const optionValue = match[2].trim();
      if (!(optionName in options)) {
        options[optionName] = '';
      }
      if (options[optionName] !== '') {
        options[optionName] += ' ';
      }
      options[optionName] += optionValue;
    }
  
    return options;
  }
  
  const inputString = '--od > 5 --od < 7 --ar < 7 --pp 2000 --cs 4.2 --mapper Puparia';
  const separatedOptions = separateOptionsWithArguments(inputString);
  console.log(separatedOptions);
  