import { useMemo, useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Button } from '@mui/material';
import { PDFDownloadLink, Text, Document, Page, PDFViewer, StyleSheet, View} from '@react-pdf/renderer'
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { pdfToText } from '../utils/pdf';
import './DashboardAppPage.css'

// ----------------------------------------------------------------------
export default function DashboardAppPage() {
  const [jobDescription, setJobDescription] = useState();
  const [resumeText, setResumeText] = useState();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const [coverletter, setCoverletter] = useState('Dear Hiring Manager,\n\n...')

  const divRef = useRef(null);
  const [fontsize, setFontsize] = useState(12)

  useEffect(() => {
    function handleResize() {
      const { offsetWidth, offsetHeight } = divRef.current;

      setFontsize(Math.floor(0.027 * offsetWidth));
    }
    window.addEventListener('resize', handleResize)
  }, [divRef.current])

  const parsePDF = (file, onParsed) => {
    if (file.type !== 'application/pdf') {
      console.log("Error: resume must be a pdf file");
      return
    }
  
    const fr=new FileReader();
    fr.onload= () => {
        pdfToText(fr.result, () => {}, (text) => {
          setResumeText(text);
          console.log(process.env.REACT_APP_BASE_URL)

          onParsed(text)
        });
    }
    fr.readAsDataURL(file)
  }

  const handleGenerate = (e) => {
    if (!file) {
      console.log("Error: Resume must be a pdf format")
      return
    }

    parsePDF(file, (resumeText) => {
      // setLoading(true)
      // axios.post(`${process.env.REACT_APP_BASE_URL}/generate`, {
      //   resume: resumeText,
      //   desc: jobDescription,
      // }).then(res => {
      //   setLoading(false)
      //   console.log(res.data.message)
      //   setCoverletter(res.data.message)
      // });
      setCoverletter('Dear Hiring Manager,\n' +
      '\n' +
      'I am writing to apply for the Full Stack Developer position at your company. As a Software Developer at the University of Waterloo, I have a strong background in coding. I demonstrated this skill in my past experience by developing several web and software applications for the university. Additionally, I possess the required technical abilities for the job, as well as exemplary problem-solving and communication skills. \n' +
      '\n' +
      'Thank you for your consideration. I look forward to speaking with you further about this opportunity.\n' +
      '\n' +
      'Sincerely, \n' +
      '[Your Name]')
    })
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
  },
  section: {
    margin: 15,
    padding: 15,
    flexGrow: 1,
  }
});
  
  const GeneratePDF = () =>(
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text>
                {coverletter}
              </Text>
            </View>
          </Page>
        </Document>
  )

  return (
    <>
      <Helmet>
        <title> CoverHelper </title>
      </Helmet>
     {/* <div className='CoverletterHolder'>
        {loading && <CircularProgress style={{alignSelf:'center'}}/>}
      </div> */}
      <div className='main'>
      <div className= 'leftSide'>
        <div className="fileUpload wrapper" style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '5px',
        }}>
          <AttachFileIcon/>
          <div> {file==null ? "Attach Resume/CV":`${file.name}`} </div>
          <input type="file" onChange={handleFileChange} className="custom-file-upload"/>
        </div>
        <TextField
          id="outlined-multiline-static"
          label="Job Description"
          multiline
          rows={12}
          style = {{width:'25rem'}}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <Button variant="contained" onClick={handleGenerate} style={{width:'8rem'}}>
            Generate
        </Button>
      </div>
      <div className='rightSide'>
        <div className="page">
          <div className="page-content" ref={divRef} style={{
            fontSize: `${fontsize}px`,
          }}>
            <p>{coverletter}</p>
          </div>
        </div>
        {coverletter !== '' &&
          <div className='button-container'>
            <PDFDownloadLink document={<GeneratePDF/> }fileName="CoverLetter.pdf">
              {({loading}) => 
                loading ? (
                    <Button variant="contained" style={{width:'8rem'}}>Loading document...</Button>
                ) : (
                    <Button variant="contained" style={{width:'8rem'}}>Download</Button>
                )
              }
            </PDFDownloadLink>
          </div>
        }
      </div>
      </div>
    </>
  );
}
