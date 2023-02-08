import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.3.122/pdf.worker.js";

export function pdfToText(data, callbackPageDone, callbackAllDone) {
    console.assert(data instanceof ArrayBuffer || typeof data === 'string');
    const loadingTask = pdfjsLib.getDocument(data);
    loadingTask.promise.then((pdf) => {
      const total = pdf._pdfInfo.numPages;
      const layers = {};
      for (let i = 1; i <= total; i += 1) {
        pdf.getPage(i).then((page) => {
          page.getTextContent().then((textContent) => {
            if (textContent.items != null) {
              let pageText = '';
              let lastBlock = null;
              for (let k = 0; k < textContent.items.length; k += 1) {
                const block = textContent.items[k];
                if (lastBlock != null && lastBlock.str[lastBlock.str.length - 1] !== ' ') {
                  if (block.x < lastBlock.x) {
                    pageText += '\r\n';
                  } else if (lastBlock.y !== block.y && (lastBlock.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null)) {
                    pageText += ' ';
                  }
                }
                pageText += block.str;
                lastBlock = block;
              }
              if (textContent != null) console.log(`page ${page.pageNumber} finished.`);
              layers[page.pageNumber] = `${pageText}\n\n`;
            }
  
            if (i === total) {
              setTimeout(() => {
                let fullText = '';
                const numPages = Object.keys(layers).length;
                for (let j = 1; j <= numPages; j += 1) {
                  fullText += layers[j];
                }
                callbackAllDone(fullText);
              }, 1000);
            }
          });
        });
      }
    });
  };