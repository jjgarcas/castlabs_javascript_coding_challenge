const getBoxSize = sizeBytes => sizeBytes.reduce((size, currentValue) => 255 * size + currentValue, 0);

const getBoxType = typeBytes => typeBytes.reduce((type, currentValue) => type + String.fromCharCode(currentValue), '');

const parseBoxes = arrayBuffer => {
  let index = 0;
  const arrayLength = arrayBuffer.byteLength;
  while(index < arrayLength) {
    const size = getBoxSize(new Uint8Array(arrayBuffer.slice(index, index + 4)));
    const type = getBoxType(new Uint8Array(arrayBuffer.slice(index + 4, index + 8)));
    console.log(`Found box of type ${type} and size ${size}`);
    if (type === 'moof' || type === 'traf') {
      parseBoxes(arrayBuffer.slice(index + 8, index + size));
    } else if (type === 'mdat') {
      //show xml content
    }
    index += size;
  }
};

(
  function() {
    const fileName = 'http://demo.castlabs.com/tmp/text0.mp4';
    fetch(fileName)
      .then(response => {
        console.log(`Succesfully loaded file ${fileName}`);
        return response.blob();
      })
      .then(blob => blob.arrayBuffer())
      .then(arrayBuffer => parseBoxes(arrayBuffer));

  }
)();