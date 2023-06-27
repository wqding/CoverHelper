import { Text, Document, Page, StyleSheet, View} from '@react-pdf/renderer'
import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.worker.js";

export const pdfToText = (data, callbackPageDone, callbackAllDone) => {
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
            if (textContent != null) {
              callbackPageDone(page.pageNumber, pageText)
            }
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

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    padding: '1in'
  },
  section: {
    flexGrow: 1,
  }, 
  text: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
    wordSpacing: 2,
  }
});
  
export const generatePDF = (text) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.text}>
          {text}
        </Text>
      </View>
    </Page>
  </Document>
);