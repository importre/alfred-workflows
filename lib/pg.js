const url = [
  'https://api.github.com/repos',
  'krschultz/android-proguard-snippets',
  'git/trees/master?recursive=1'
].join('/');

module.exports = {
  url: url,
  parse: response => {
    const result = JSON.parse(response.body);
    if (result.truncated) {
      throw '[pg]: truncated result';
    }
    return result.tree;
  }
};

