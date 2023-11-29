import formidable from 'formidable';
import pdfjsLib from 'pdfjs-dist';

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  export default async function uploadPdf(req, res) {
    const form = formidable({ multiples: false });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error parsing the form' });
        return;
      }
  
      const { file } = files;
  
      try {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const typedArray = new Uint8Array(fileReader.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          const totalNumPages = pdf.numPages;
          let combinedText = '';
          for (let pageNum = 1; pageNum <= totalNumPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const text = textContent.items.map((item) => item.str).join(' ');
            combinedText += text;
          }
          res.status(200).json({ userInput: combinedText });
        };
        fileReader.readAsArrayBuffer(file.path);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error extracting text from the PDF' });
      }
    });
  }