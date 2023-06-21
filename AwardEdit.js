import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import DatePicker from "react-datepicker";
import TemplateLayoutHOC from '../Pages/TemplateLayoutHOC';
import textResources from '../../constants/app-strings';
// import { history } from '../../routers/AppRouter';
import { showSnackbar, showLoader, hideLoader } from '../../actions/ui';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import { TrainingService } from '../../services/award-service';
import { AwardEditSchema } from './schema/AwardEditSchema';
// import { SkillsetService } from '../../services/skillset-service';
// import Select from 'react-select'
// import { data, get } from 'jquery';
import pickBy from 'lodash/pickBy';
import { trimObj } from '../../utils/utilities';
import InputFile from '../Common/InputFile';
import Breadcrumb from '../Common/Breadcrumb';
import CheckPermission from '../Pages/CheckPermission';
import moment from 'moment';


const AwardEdit = () => {
    const { id } = useParams();
    //console.log('editparamsid', id);
    const dispatch = useDispatch();
    // const skillvalue = [];
    // const [selectedPicture, setSelectedPicture] = useState(false);
    const [statuses, setStatus] = useState([]);
    // const [preSelectedSkillsSet, setPreSelectedSkillsSet] = useState([]);
    // const [skillId, setSkillId] = useState([]);
    const [details, setDetails] = useState({
        awardTitle: '',
        issueDate: moment(new Date()).format('YYYY-MM-DD'),
        status: '',
        description: '',
        signatureName1: '',
        signatureName2: '',
        signatureDesgnation1: '',
        signature_Designation2: '',
        providedBy: '',
        logoPath: '',
        signature1Filepath: '',
        signature2Filepath: ''
    });

    const [logo, setLogo] = useState();
    const [signature1, setSignature1] = useState();
    const [signature2, setSignature2] = useState();
    // const [pgmSchedule, setpgmSchedule] = useState();
    const [trainingProgramId, settrainingProgramId] = useState();
    // const [skillsSet, setSkillsSet] = useState([]);
    // const [getLogo, setLogoChange] = useState();
    // const [getschedule, setScheduleChange] = useState();
    const [getSignature1, setSignature1Change] = useState();
    const [getSignature2, setSignature2Change] = useState();

    const [logoFile, setLogoFile] = useState();
    const [signature1File, setSignature1File] = useState();
    const [signature2File, setSignature2File] = useState();
    // const [pgmScheduleFile, setpgmScheduleFile] = useState();




    const updateTraining = async (values) => {
        try {
            dispatch(showLoader());
            let formData = new FormData();
            const datas = pickBy(trimObj(values));

            for (let key of Object.keys(datas)) {
                formData.append(key, datas[key]);
            }
            formData.delete("logo");
            formData.append("logo", logo);
            console.log("FormaData...", formData);
            let { data } = await TrainingService.updateTrainingProgram(id, formData);
            dispatch(hideLoader())
            dispatch(showSnackbar({
                message: data.responseMessage,
                type: "success"
            }));
        } catch (error) {
            dispatch(showSnackbar({
                message: error.response.data.responseMessage,
                type: "error"
            }));
            dispatch(hideLoader())
        }

    }

    const getStatus = async () => {
        const { data } = await TrainingService.getAllStatus(
            { search: "" }
        )
        // console.log('data........',data);
        setStatus(data.data)
    }

    // const signature1Change = event => {
    //     const files = event.target.files;
    //     setSignature1(files[0]);
    // };
    // const signature2Change = event => {
    //     const files = event.target.files;
    //     setSignature2(files[0]);
    // };
    // const logoChange = event => {
    //     const files = event.target.files;
    //     setLogo(files[0]);
    //     setDetails({
    //         ...details,
    //         logoPath: event.target.files
    //     });
    //     console.log("daetails..", details);


    // };
    // const pgmScheduleChange = event => {
    //     console.log(event.target);
    //     const files = event.target.files;
    //     setpgmSchedule(files[0]);
    // };

    // const uploadLogo = () => {
    //     if (logo) {
    //         console.log('id................. ', trainingProgramId);
    //         console.log('logo', logo);
    //         let formData = new FormData();
    //         formData.append('logo', logo);
    //         if (trainingProgramId)
    //             formData.append('id', trainingProgramId);
    //         else
    //             formData.append('id', 1);
    //         console.log('logo', formData);
    //         const Data = TrainingService.addLogo(formData);
    //         updatelogo();
    //     }
    // }
    const uploadSignature1 = async () => {
        try {
            if (signature1) {
                console.log('signature1', signature1);
                let formData = new FormData();
                formData.append('signature1', signature1);
                if (trainingProgramId)
                    formData.append('id', trainingProgramId);
                else
                    formData.append('id', 1);
                console.log('signature1', formData);
                const Data = await TrainingService.addSignature1(formData);
                console.log("data...,", Data);
                updateSignature1();
            }
        } catch (error) {
            dispatch(showSnackbar({
                message: error.response.data.responseMessage,
                type: "error"
            }));
            dispatch(hideLoader())
        }
    }
    const uploadSignature2 = async () => {
        try {
            if (signature2) {
                console.log('signature2', signature2);
                let formData = new FormData();
                formData.append('signature2', signature2);
                if (trainingProgramId)
                    formData.append('id', trainingProgramId);
                else
                    formData.append('id', 1);
                console.log('signature2', formData);
                 await TrainingService.addSignature2(formData);
                updateSignature2();
            }
        } catch (error) {
            dispatch(showSnackbar({
                message: error.response.data.responseMessage,
                type: "error"
            }));
            dispatch(hideLoader())
        }
    }
    const getTrainingProgramId = (ids) => {
        // console.log('set data return', data);
        settrainingProgramId(ids);
    }

    // const updatelogo = () => {
    //     setLogoChange('fas fa-check-circle green');
    // }
    // const updateSchedule = () => {
    //     setScheduleChange('fas fa-check-circle green');
    // }
    const updateSignature1 = () => {
        setSignature1Change('fas fa-check-circle green');
    }
    const updateSignature2 = () => {
        setSignature2Change('fas fa-check-circle green');
    }

    // const ColoredLine = ({ color }) => (
    //     <hr
    //         style={{
    //             color: color,
    //             backgroundColor: color,
    //             height: 5
    //         }}
    //     />
    // );

    const fetchTrainingDetails = async () => {
        //console.log('update page id',id);
        let { data } = await TrainingService.getTrainings({
            id: id
        });
        setDetails({ ...details, ...data.data });

        let logo1path = data.data.logoPath;
        let schedule1path = data.data.pgmScheduleFilepath;
        let signatures1path = data.data.signature1Filepath;
        let signature2path = data.data.signature2Filepath;

        if (logo1path != 0 && logo1path) {
            // setLogoChange('fas fa-check-circle green');
            let pathArray = logo1path.split('/');
            let filename = pathArray[pathArray.length - 1];
            let filenameOriginal = filename.substring(14);
            console.log('logo file original...', filenameOriginal);
            setLogoFile(filenameOriginal);

        }

        if (schedule1path && schedule1path != 0) {
            // setScheduleChange('fas fa-check-circle blue');
            let schedulePathArray = schedule1path.split('/');
            let filename = schedulePathArray[schedulePathArray.length - 1];
            let filenameOriginal = filename.substring(14);
            console.log('schedule file original...', filenameOriginal);
            // setpgmScheduleFile(filenameOriginal);

        }

        if (signatures1path) {
            setSignature1Change('fas fa-check-circle blue');
            let pathArray = signatures1path.split('/');
            console.log('signature file1 path...', signatures1path);
            let filename = pathArray[pathArray.length - 1];
            console.log('signature file1...', filename);
            let filenameOriginal = filename.substring(14);
            console.log('signature file1 original...', filenameOriginal);
            setSignature1File(filenameOriginal);

        }

        if (signature2path) {
            setSignature2Change('fas fa-check-circle blue');
            let pathArray = signature2path.split('/');
            let filename = pathArray[pathArray.length - 1];
            let filenameOriginal = filename.substring(14);
            console.log('signature file2 original...', filenameOriginal);
            setSignature2File(filenameOriginal);

        }

        console.log('data', data)
    }

    useEffect(() => {
        fetchTrainingDetails();
        getStatus();
        getTrainingProgramId(id);
    }, []);


    const breadCrumbs = [
        { name: 'Award List', path: '/award/list', styleClass: 'breadcrumb-item breadcrumb-item-list' },
        {
            name: 'Edit Award',
            path: null,
            styleClass: 'breadcrumb-item'
        }
    ];
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={details}
                validationSchema={AwardEditSchema}
                onSubmit={values => {
                    updateTraining(values);
                }}
            >
                {({ errors, touched, setFieldValue }) => (
                    <main >
                        <div id="mainContent">
                            <div className="container-fluid p-0">
                                <Form className="pt-5 marg" encType="multipart/form-data">
                                    <h4 className="mB-20 text-center font-weight-bold page-title header-btn header-margin">
                                        EDIT AWARDS ISSUED
                                    </h4>
                                    <hr className="mT-5 underline header-btn" />
                                    <Breadcrumb
                                        items={breadCrumbs}
                                    />
                                    <div className="settings-wrap mB-20 ">
                                        <h4 className="settings-head">Edit Award</h4>
                                        <div className="p-r">

                                            <div className='pull-left half-width pR-15 pL-10 split'>
                                                <div className='form-row'>

                                                    <div className='form-group col-md-6'>
                                                        <label className='label-profile' htmlFor='awardTitle'>
                                                            Title
                                                            <span className='asterix'>&nbsp;&#42;</span>
                                                        </label>
                                                        <Field
                                                            type='text'
                                                            name='awardTitle'
                                                            className='form-control'
                                                            placeholder='Title'
                                                            value={details.awardTitle}
                                                            onChange={
                                                                (e) => {
                                                                    setDetails({
                                                                        ...details,
                                                                        awardTitle: e.target.value
                                                                    });
                                                                }
                                                            }
                                                        />
                                                        <ErrorMessage className={`${touched.awardTitle && errors.awardTitle ? "invalid-text" : ""
                                                            }`} name="awardTitle" component="div" />
                                                    </div>
                                                    <div className='form-group col-md-6'>
                                                        <label className='label-profile' htmlFor='providedBy'>
                                                            Provided By
                                                            <span className='asterix'>&nbsp;&#42;</span>
                                                        </label>
                                                        <Field
                                                            disabled={details.providedBy}
                                                            type='text'
                                                            name='providedBy'
                                                            className='form-control'
                                                            placeholder='providedBy'
                                                            value={details.providedBy}
                                                            onChange={
                                                                (e) => {
                                                                    setDetails({
                                                                        ...details,
                                                                        providedBy: e.target.value
                                                                    });
                                                                }
                                                            }
                                                        />
                                                        <ErrorMessage className={`${touched.providedBy && errors.providedBy ? "invalid-text" : ""
                                                            }`} name="providedBy" component="div" />
                                                    </div>

                                                    <div className='form-group col-md-6'>
                                                        <label className='label-profile' htmlFor='trainingStartDate'>
                                                            Issued Date
                                                            <span className='asterix'>&nbsp;&#42;</span>
                                                        </label>
                                                        <Field
                                                            type='date'
                                                            max="9999-12-31"
                                                            name='issueDate'
                                                            className='form-control'
                                                            selected={moment(details.issueDate).format('YYYY-MM-DD')}
                                                            onChange={
                                                                (e) => {
                                                                    setFieldValue('issueDate', e.target.value);

                                                                    setDetails({
                                                                        ...details,
                                                                        issueDate: e.target.value
                                                                    });
                                                                }
                                                            }
                                                        />
                                                        <ErrorMessage className={`${touched.issueDate && errors.issueDate ? "invalid-text" : ""
                                                            }`} name="issueDate" component="div" />
                                                    </div>
                                                    <div className='form-group col-md-6'>
                                                        <label className='label-profile' htmlFor='status'>
                                                            Status
                                                            <span className='asterix'>&nbsp;&#42;</span>
                                                        </label>

                                                        <select value={details.status} className="form-control" name="status"
                                                            onChange={
                                                                (e) => {
                                                                    setFieldValue('status', e.target.value);

                                                                    setDetails({
                                                                        ...details,
                                                                        status: e.target.value,

                                                                    });
                                                                    console.log('status12345', details.status, e.target.value);
                                                                }
                                                            }
                                                        >
                                                            <option disabled="">Select Status</option>
                                                            {statuses.map(status => <option value={status.id}>{status.enumValue}</option>)}
                                                        </select>
                                                        <ErrorMessage className={`${touched.status && errors.status ? "invalid-text" : ""
                                                            }`} name="status" component="div" />
                                                    </div>


                                                    <div className='form-group col-md-6'>

                                                        <label className='label-profile' htmlFor='signatureName1'>
                                                            Signature I
                                                            <span className='asterix'>&nbsp;&#42;</span>
                                                        </label>
                                                        <Field
                                                            type='text'
                                                            name='signatureName1'
                                                            className='form-control'
                                                            placeholder='Signature I'
                                                            value={details.signatureName1}
                                                            onChange={
                                                                (e) => {
                                                                    setDetails({
                                                                        ...details,
                                                                        signatureName1: e.target.value
                                                                    });
                                                                }
                                                            }
                                                        />
                                                        <ErrorMessage className={`${touched.signatureName1 && errors.signatureName1 ? "invalid-text" : ""
                                                            }`} name="signatureName1" component="div" />

                                                    </div>
                                                    <div className='form-group col-md-6 '>

                                                        <label className='label-profile' htmlFor='signatureDesgnation1'>
                                                            Designation I
                                                            <span className='asterix'>&nbsp;&#42;</span>
                                                        </label>
                                                        <Field
                                                            type='text'
                                                            name='signatureDesgnation1'
                                                            className='form-control'
                                                            placeholder='Designation I'
                                                            //value={details.signatureDesignation1}
                                                            onChange={
                                                                (e) => {
                                                                    setDetails({
                                                                        ...details,
                                                                        signatureDesgnation1: e.target.value
                                                                    });
                                                                }
                                                            }
                                                        />
                                                        <ErrorMessage className={`${touched.signatureDesgnation1 && errors.signatureDesgnation1 ? "invalid-text" : ""
                                                            }`} name="signatureDesgnation1" component="div" />
                                                    </div>




                                                    <div className='form-group col-md-6'>

                                                        <label className='label-profile' htmlFor='signatureName2'>
                                                            Signature II
                                                            <span className='asterix'>&nbsp;&#42;</span>
                                                        </label>
                                                        <Field
                                                            type='text'
                                                            name='signatureName2'
                                                            className='form-control'
                                                            placeholder='Signature II '
                                                            value={details.signatureName2}
                                                            onChange={
                                                                (e) => {
                                                                    setDetails({
                                                                        ...details,
                                                                        signatureName2: e.target.value
                                                                    });
                                                                }
                                                            }
                                                        />
                                                        <ErrorMessage className={`${touched.signatureName2 && errors.signatureName2 ? "invalid-text" : ""
                                                            }`} name="signatureName2" component="div" />

                                                    </div>
                                                    <div className='form-group col-md-6 '>

                                                        <label className='label-profile' htmlFor='signature_Designation2'>
                                                            Designation II
                                                            <span className='asterix'>&nbsp;&#42;</span>
                                                        </label>
                                                        <Field
                                                            type='text'
                                                            name='signature_Designation2'
                                                            className='form-control'
                                                            placeholder='Designation II '
                                                            value={details.signature_Designation2}
                                                            onChange={
                                                                (e) => {
                                                                    setDetails({
                                                                        ...details,
                                                                        signature_Designation2: e.target.value
                                                                    });
                                                                }
                                                            }
                                                        />
                                                        <ErrorMessage className={`${touched.signature_Designation2 && errors.signature_Designation2 ? "invalid-text" : ""
                                                            }`} name="signature_Designation2" component="div" />
                                                        <ErrorMessage className={`${touched.signatureDesignation2 && errors.signatureDesignation2 ? "invalid-text" : ""
                                                            }`} name="signatureDesignation2" component="div" />

                                                    </div>

                                                    <div className='up col-md-12'>
                                                        <label className='label-profile' htmlFor='description'>
                                                            Description <span className="desc" >(Max:250 chars)
                                                            </span>
                                                            <span className='asterix'>&nbsp;&#42;</span>
                                                        </label>
                                                        <Field
                                                            type='text'
                                                            component='textarea'
                                                            name='description'
                                                            className='form-control'
                                                            placeholder='Description'
                                                            value={details.description}
                                                            onChange={
                                                                (e) => {
                                                                    setDetails({
                                                                        ...details,
                                                                        description: e.target.value
                                                                    });
                                                                }
                                                            }
                                                        />
                                                        <ErrorMessage className={`${touched.description && errors.description ? "invalid-text" : ""
                                                            }`} name="description" component="div" />
                                                    </div>

                                                    <div className='col-md-12'>
                                                        <label className='new-label-award' htmlFor='Logo'>
                                                            Logo <label className='logodimensions' htmlFor='Logo'>
                                                                (Height:200Px Width:200Px)
                                                            </label>
                                                            <span className='asterix'>&nbsp;&#42;</span>

                                                        </label>


                                                        <InputFile
                                                            acceptType=".png,.jpeg,.jpg"
                                                            fileChange={val => {
                                                                setLogoFile('');
                                                                console.log('file value...', val);
                                                                setLogo(val);
                                                            }}
                                                            name="logoPath"
                                                            defaultValue={logoFile}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='clear'></div>

                                            <div className='ta-c save-button'>
                                                <Link to="/award/list">
                                                    <button
                                                        type='button'
                                                        className='btn cur-p btn-secondary btn-save2'
                                                    >
                                                        {textResources.CANCEL}
                                                    </button>
                                                </Link>

                                                <button type='submit' className='btn cur-p btn-success btn-save2'>
                                                    {textResources.SAVE}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>

                    </main>
                )}
            </Formik>
            <div>

                <div className="settings-wrap mB-20 marg">
                    <h4 className="settings-head">Edit Signature</h4>
                    <div className="p-r2">

                        <div className='form-row'>
                            <div className='col-md-6'>
                                <label className='label-signature' htmlFor='signature1'>
                                    Signature I<span className='asterix'>&nbsp;&#42;</span>
                                </label>
                                <InputFile
                                    acceptType=".png,.jpeg,.jpg"

                                    fileChange={val => {
                                        setSignature1File('');
                                        console.log('file value...', val);
                                        setSignature1(val);
                                    }}
                                    name="signature1"
                                    defaultValue={signature1File}
                                    isEnableUploadBtn="true"
                                    uploadBtnValue={textResources.UPLOAD}
                                    uploadBtnOnClick={uploadSignature1}
                                    uploadTick={getSignature1}
                                />
                            </div>
                        </div>


                        <div className='form-row'>
                            <div className='col-md-6'>
                                <label className='label-profile' htmlFor='signature2'>
                                    Signature II<span className='asterix'>&nbsp;&#42;</span>
                                </label>
                                <InputFile
                                    acceptType=".png,.jpeg,.jpg"

                                    fileChange={val => {
                                        setSignature2File('');
                                        console.log('file value...', val);
                                        setSignature2(val);
                                    }}
                                    name="signature2"
                                    defaultValue={signature2File}
                                    isEnableUploadBtn="true"
                                    uploadBtnValue={textResources.UPLOAD}
                                    uploadBtnOnClick={uploadSignature2}
                                    uploadTick={getSignature2}
                                />
                            </div>
                        </div>

                    </div>
                </div>












{/*ASHISH*/}

                <div className="settings-wrap mB-20 marg">
                    <h4 className="settings-head">ID Proof</h4>
                    <div className="p-r2">

                        <div className='form-row'>
                            <div className='col-md-6'>
                                <label className='label-signature' htmlFor='signature1'>
                                    Upload Document<span className='asterix'>&nbsp;&#42;</span>
                                </label>
                                <InputFile
                                    acceptType=".png,.jpeg,.jpg"

                                    fileChange={val => {
                                        setSignature1File('');
                                        console.log('file value...', val);
                                        setSignature1(val);
                                    }}
                                    name="signature1"
                                    defaultValue={signature1File}
                                    isEnableUploadBtn="true"
                                    uploadBtnValue={textResources.UPLOAD}
                                    uploadBtnOnClick={uploadSignature1}
                                    uploadTick={getSignature1}
                                />
                            </div>
                     
                        </div>

                    </div>
                </div>     {/*ASHISH*/}

















            </div>
        </div>
    )
}

export default TemplateLayoutHOC(
    CheckPermission(AwardEdit)(['awards-update'], ['COMPANY'])
);
