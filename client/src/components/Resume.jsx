import ErrorPage from "./ErrorPage";
import { useReactToPrint } from "react-to-print";
import React, { useRef } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

const Resume = ({ result }) => {
    const componentRef = useRef();
    //👇🏻 function that replaces the new line with a break tag
    const replaceWithBr = (string) => {
        return string?.replace(/\n/g, "<br />");
    };

    //👇🏻 returns an error page if the result object is empty
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${result.fullName} Resume`,
        onAfterPrint: () => alert("Print Successful!"),
    });
    console.log(result);
    return (
        <>
            {JSON.stringify(result) === "{}" ? (
                <ErrorPage />
            ) : (
                <>
                    <button onClick={handlePrint} style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '20px',
                        cursor: 'pointer',
                        border: 'none',
                    }}>Print Page</button>
                    <main className='container' ref={componentRef} style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <header className='header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ color: '#338BA8' }}>{result.fullName}</h1>
                                <h2 className='resumeTitle headerTitle'>
                                    {result.currentPosition}
                                </h2>
                                <p className='resumeTitle headerTitle'>Specialized in ({result.currentTechnologies})</p>
                                {/*<p className='resumeTitle'>
            {result.currentLength}year(s) work experience
           </p>*/}
                                <p>Email : {result.email}</p>
                            </div>
                            <div>
                                <img
                                    src={`${apiUrl}${result.image_url}`}
                                    alt={result.fullName}
                                    className='resumeImage'
                                    style={{ borderRadius: '50%', width: '120px', height: '120px', objectFit: 'cover' }}
                                />
                            </div>
                        </header>
                        <div className='resumeBody' style={{ backgroundColor: 'white', padding: '20px', borderRadius: ' 0 0 10px 10px  ', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ marginBottom: '30px' }}>
                                <h2 className='resumeBodyTitle' style={{ color: '#338BA8', borderBottom: '2px solid #338BA8', paddingBottom: '10px' }}>PROFILE SUMMARY</h2>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: replaceWithBr(result.objective?.message?.content),
                                    }}
                                    className='resumeBodyContent'
                                />
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <h2 className='resumeBodyTitle' style={{ color: '#338BA8', borderBottom: '2px solid #338BA8', paddingBottom: '10px' }}>WORK HISTORY</h2>
                                {result.workHistory.map((work) => (
                                    <p className='resumeBodyContent' key={work.name}>
                                        <span style={{ fontWeight: "bold" }}>{work.name}</span> -{" "}
                                        {work.position}
                                    </p>
                                ))}
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <h2 className='resumeBodyTitle' style={{ color: '#338BA8', borderBottom: '2px solid #338BA8', paddingBottom: '10px' }}>JOB PROFILE</h2>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: replaceWithBr(result.keypoints?.message?.content),
                                    }}
                                    className='resumeBodyContent'
                                />
                            </div>
                            <div>
                                <h2 className='resumeBodyTitle' style={{ color: '#338BA8', borderBottom: '2px solid #338BA8', paddingBottom: '10px' }}>JOB RESPONSIBILITIES</h2>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: replaceWithBr(result.jobResponsibilities?.message?.content),
                                    }}
                                    className='resumeBodyContent'
                                />
                            </div>
                        </div>
                    </main>
                </>
            )}
        </>
    );


};
export default Resume;