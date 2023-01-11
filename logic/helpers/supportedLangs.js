module.exports = {
  obtainLanguage(code) {
    switch (code) {
      case "en":
        return "english";
      case "jp":
        return "japanese";
      case "zh":
        return "chinese";
      case "fr":
        return "french";
      default:
        return "english";
    }
  },
};
