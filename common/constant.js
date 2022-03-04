const UPLOAD_ACCEPT_LOOKUP = {
    'File': [
      '.doc',
      '.docx',
      '.pdf',
      '.xls',
      '.xlsx',
      '.txt'
    ].join(', '),
    'Video': [
      'audio/mpeg',
      'video/mp4',
      'video/mpeg',
    ].join(', '),
    'Audio': [
      'audio/mp3',
      'audio/wav',
    ].join(', '),
    'Image': [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/svg',
      'image/gif',
      'image/bmp',
    ].join(', ')
};

const PAGE_STATE_VAR_TAG_REGEX = /\$\{(\w+)\.(\w+)\}/g;
const PROJECT_VARIABLE_REGEX = /\$\{(\w+)\.(\w+)\.(\w+)\}/g;

export {
    UPLOAD_ACCEPT_LOOKUP,
    PAGE_STATE_VAR_TAG_REGEX,
    PROJECT_VARIABLE_REGEX
}