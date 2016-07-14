const url = [
  'https://api.github.com/repos',
  'github/gitignore',
  'git/trees/master?recursive=1'
].join('/');

module.exports = {
  url: url,
  parse: response => {
    const result = JSON.parse(response.body);
    if (result.truncated) {
      throw '[gi]: truncated result';
    }
    return result.tree;
  }
};

