import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import DatePicker from "react-datepicker";
// import { Creatable } from 'react-select';
// import FAIcon from '../Common/FAIcon';
import TemplateLayoutHOC from '../Pages/TemplateLayoutHOC';
// import project_constants from '../../constants/project-constants';
import textResources from '../../constants/app-strings';
// import { history } from '../../routers/AppRouter';
import { showSnackbar, showLoader, hideLoader } from '../../actions/ui';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
// import { EmployeeService } from '../../services/employee-service';
import { TrainingNewSchema } from './schema/TrainingNewSchema';
// import swal from 'sweetalert';
import { TrainingService } from '../../services/training-service';
import { SkillsetService } from '../../services/skillset-service';
import Select from 'react-select';
import pickBy from 'lodash/pickBy';
import { trimObj } from '../../utils/utilities';
import InputFile from '../Common/InputFile';
import Breadcrumb from '../Common/Breadcrumb';
// import { faSync } from '@fortawesome/free-solid-svg-icons';
// import { CompanyService } from '../../services/company-service';
import CheckPermission from '../Pages/CheckPermission';
import { checkUrlParam, checkNoUrlParam } from '../../utils/utilities';
import moment from 'moment';


const initialValues = {
    trainingProgramName: '',
    trainersNames: '',
    trainersProfile: '',
    trainingStartDate: moment(new Date()).format('YYYY-MM-DD'),
    trainingEndDate: moment(new Date()).format('YYYY-MM-DD'),
    trainingMeetingLink: '',
    status: '',
    // logo: '',
    description: '',  //upto desciption is ok
    skills: '',
    signatureName1: '',
    signatureName2: '',
    signatureDesignation1: '',
    signatureDesignation2: '',
    logo: '',   //@ash   => line 636, 637
    providedBy: '',
    skillsIds: [],
    //buttonStyle:'disabledbutton'
};

const TrainingNew = () => {
    // const { id } = useParams();
    const dispatch = useDispatch();
    const skillvalue = [];
    // const [details, setDetails] = useState(initialValues);
    const [details, setDetails] = useState({
        trainingProgramName: '',
        trainersNames: '',
        trainersProfile: '',
        trainingStartDate: moment(new Date()).format('YYYY-MM-DD'),
        trainingEndDate: moment(new Date()).format('YYYY-MM-DD'),
        trainingMeetingLink: '',
        status: '',
        // logo: '',
        description: '',
        skills: '',
        signatureName1: '',
        signatureName2: '',
        signatureDesignation1: '',
        signatureDesignation2: '',
        logo: '',
        providedBy: '',
        skillsIds: skillvalue,
    });
    const [logo, setLogo] = useState();
    const [signature1, setSignature1] = useState();
    const [signature2, setSignature2] = useState();
    const [statuses, setStatus] = useState([]);
    const [pgmSchedule, setpgmSchedule] = useState();
    const [trainingProgramId, settrainingProgramId] = useState();
    const [skillsSet, setSkillsSet] = useState([]);
    // const [getLogo, setLogoChange] = useState();
    const [getschedule, setScheduleChange] = useState();
    const [getSignature1, setSignature1Change] = useState();
    const [getSignature2, setSignature2Change] = useState();
    const [buttonStyle, setButtonStyle] = useState();
    // const [defaultValue, setdefaultValue] = useState();

    const [logoFile, setLogoFile] = useState();
    const [signature1File, setSignature1File] = useState();
    const [signature2File, setSignature2File] = useState();
    const [pgmScheduleFile, setpgmScheduleFile] = useState();
    const [preSelectedSkillsSet, setPreSelectedSkillsSet] = useState([]);


    const addNewTraining = async (values) => {

        try {
            dispatch(showLoader());
            values.id = trainingProgramId;
            let formData = new FormData();
            const datas = pickBy(trimObj(values));

            for (let key of Object.keys(datas)) {
                formData.append(key, datas[key]);
            }
            formData.delete("logo");
            formData.append("logo", logo);
            console.log("FormaData...", formData);

            if (trainingProgramId == null) {
                let { data } = await TrainingService.addNewTraining(formData);
                //  console.log('traing data return', data);
                getTrainingProgramId(data);

                dispatch(hideLoader())
                dispatch(showSnackbar({
                    message: data.responseMessage,
                    type: "success"
                }));
                window.location.reload(false);
            } else {
                console.log("update...");
                const id = trainingProgramId;
                let { data } = await TrainingService.updateTrainingProgram(id, formData);
                dispatch(hideLoader())
                dispatch(showSnackbar({
                    message: data.responseMessage,
                    type: "success"
                }));

            }

            /* setTimeout(() => {
                history.push('/training/list');
            }, 700) */
        } catch (error) {
            dispatch(showSnackbar({
                message: error.response.data.responseMessage,
                type: "error"
            }));
            dispatch(hideLoader())
        }

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
    //     console.log("file..", files);
    //     setLogo(files[0]);
    // };
    // const pgmScheduleChange = event => {
    //     const files = event.target.files;
    //     setpgmSchedule(files[0]);
    // };

    // const uploadLogo = () => {
    //     if (logo) {
    //         console.log('id................. ', trainingProgramId, 'data', trainingProgramId.data);
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
    const uploadPgmSchedule = () => {
        if (pgmSchedule) {
            console.log('pgmSchedule', pgmSchedule);
            let formData = new FormData();
            formData.append('pgmScheduleFile', pgmSchedule);
            if (trainingProgramId)
                formData.append('id', trainingProgramId);
            else
                formData.append('id', 1);
            console.log('pgmScheduleFile', formData);
             TrainingService.addPgmSchedule(formData);
            updateSchedule();
        }
    }
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
                 await TrainingService.addSignature1(formData);
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
    // const ColoredLine = ({ color }) => (
    //     <hr
    //         style={{
    //             color: color,
    //             backgroundColor: color,
    //             height: 5
    //         }}
    //     />
    // );

    const getTrainingProgramId = (data) => {
        //console.log('set data return', data);
        settrainingProgramId(data.data);
        let stateObj = { id: data.data };
        window.history.replaceState(stateObj, '?id=' + data.data, '?id=' + data.data);
        if (data.data) {
            setButtonStyle("");

        }

    }

    const getStatus = async () => {
        const { data } = await TrainingService.getAllStatus(
            { search: "" }
        )
        // console.log('data........',data);
        setStatus(data.data)
    }

    const fetchSkills = async () => {
        try {
            let { data } = await SkillsetService.fetchSkills();
            setSkillsSet(data.data);

            console.log('skills', skillsSet);

        } catch (error) {
            console.log('error in fetch skills');
        }

    }
    // const updatelogo = () => {
    //     // setLogoChange('fas fa-check-circle blue');
    // }
    const updateSchedule = () => {
        setScheduleChange('fas fa-check-circle blue');
    }
    const updateSignature1 = () => {
        setSignature1Change('fas fa-check-circle blue');
    }
    const updateSignature2 = () => {
        setSignature2Change('fas fa-check-circle blue');
    }
   
    const fetchProvidedBy = async () => {
        if (JSON.parse(localStorage.getItem('auth')) !== null) {
            details.providedBy = JSON.parse(localStorage.getItem('auth')).companyName;
        }
    }
    
    const fetchTrainingDetails = async () => {
        //console.log('update page id',id);
        const queryString = window.location.search;
        console.log(queryString);
        const urlParams = new URLSearchParams(queryString);
        //urlParams.append('size', 'xl');
        const urlparamId = urlParams.get('id');
        console.log('url param.......................................', urlparamId);
        if (urlparamId) {
            let { data } = await TrainingService.getTrainings({
                id: urlparamId
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
                console.log('signature file1 original...', filenameOriginal);
                setLogoFile(filenameOriginal);

            }

            if (schedule1path && schedule1path != 0) {
                setScheduleChange('fas fa-check-circle blue');
                let schedulePathArray = schedule1path.split('/');
                let filename = schedulePathArray[schedulePathArray.length - 1];
                let filenameOriginal = filename.substring(14);
                console.log('signature file1 original...', filenameOriginal);
                setpgmScheduleFile(filenameOriginal);

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
                console.log('signature file1 original...', filenameOriginal);
                setSignature2File(filenameOriginal);

            }

            console.log('data', data);
            settrainingProgramId(urlparamId);
            fetchPreSelectedSkills(urlparamId);
        }
        else {
            setButtonStyle("disabledbutton");
        }

    }


    const fetchPreSelectedSkills = async (id) => {
        console.log('fetchPreSelectedSkills');
        try {
            dispatch(showLoader());
            let { data } = await TrainingService.fetchPreSelectedSkills(id);
            console.log('fetchPreSelectedSkills2');

            var list = data.data;
            console.log('fetchPreSelectedSkills3');
            console.log('selectedList... ', list);
            setPreSelectedSkillsSet(list);
            list.forEach((member, index) => {
                console.log("value...", member.value);
                skillvalue[index] = member.value;

            })
            console.log("value..", skillvalue);
            console.log('preSelectedSkillsSet... ', preSelectedSkillsSet);
            dispatch(hideLoader());

        } catch (error) {
            dispatch(hideLoader());
        }

    }

    useEffect(() => {
        getStatus();
        fetchSkills();
        fetchTrainingDetails();
        fetchProvidedBy();
    }, [dispatch]);

    const breadCrumbs = [
        { name: 'Training Program List', path: '/training/list', styleClass: 'breadcrumb-item breadcrumb-item-list' },
        {
            name: 'Add New Training Program',
            path: null,
            styleClass: 'breadcrumb-item'
        }
    ];

    return (
        <div>

            {checkUrlParam() && (

                <Formik
                    enableReinitialize
                    initialValues={details}
                    validationSchema={TrainingNewSchema}
                    onSubmit={values => {
                        addNewTraining(values);
                    }}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <main className="">
                            <div id="mainContent">
                                <div className="container-fluid p-0">

                                    <Form className="pt-5 marg" encType="multipart/form-data">
                                        <h4 className="mB-20 text-center font-weight-bold page-title header-btn header-margin">
                                            ADD NEW TRAINING PROGRAM
                                        </h4>
                                        <hr className="mT-5 underline header-btn" />

                                        <Breadcrumb
                                            items={breadCrumbs}
                                        />
                                        <div className="settings-wrap mB-20">
                                            <h4 className="settings-head">Add Training Program</h4>
                                            <div className="p-r">
                                                <div className='pull-left half-width pR-15 pL-10 split'>
                                                    <div className='form-row'>


                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainingProgramName'>
                                                                Program Name
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='trainingProgramName'
                                                                className='form-control'
                                                                placeholder='Program Name '
                                                            />
                                                            <ErrorMessage className={`${touched.trainingProgramName && errors.trainingProgramName ? "invalid-text" : ""
                                                                }`} name="trainingProgramName" component="div" />
                                                        </div>

                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainersNames'>
                                                                Trainer Name
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='trainersNames'
                                                                className='form-control'
                                                                placeholder='Trainer Name'
                                                            />
                                                            <ErrorMessage className={`${touched.trainersNames && errors.trainersNames ? "invalid-text" : ""
                                                                }`} name="trainersNames" component="div" />
                                                        </div>
                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainersProfile'>
                                                                Trainer Profile
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='trainersProfile'
                                                                className='form-control'
                                                                placeholder='Trainer Profile'
                                                            />
                                                            <ErrorMessage className={`${touched.trainersProfile && errors.trainersProfile ? "invalid-text" : ""
                                                                }`} name="trainersProfile" component="div" />
                                                        </div>
                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='providedBy'>
                                                                Provided By
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                disabled
                                                                type='text'
                                                                name='providedBy'
                                                                className='form-control'
                                                                placeholder='Provided By'
                                                            />
                                                            <ErrorMessage className={`${touched.providedBy && errors.providedBy ? "invalid-text" : ""
                                                                }`} name="providedBy" component="div" />
                                                        </div>

                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainingStartDate'>
                                                                Start Date
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='date'
                                                                name='trainingStartDate'
                                                                className='form-control'
                                                                max={moment(details.trainingEndDate).format('YYYY-MM-DD')}
                                                                selected={moment(details.trainingStartDate).format('YYYY-MM-DD')}
                                                                onChange={
                                                                    (e) => {
                                                                        setFieldValue('trainingStartDate', e.target.value);

                                                                        setDetails({
                                                                            ...details,
                                                                            trainingStartDate: e.target.value
                                                                        });
                                                                    }
                                                                }
                                                            />
                                                            <ErrorMessage className={`${touched.trainingStartDate && errors.trainingStartDate ? "invalid-text" : ""
                                                                }`} name="trainingStartDate" component="div" />
                                                        </div>
                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainingEndDate'>
                                                                End Date
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='date'
                                                                name='trainingEndDate'
                                                                className='form-control'
                                                                min={moment(details.trainingStartDate).format('YYYY-MM-DD')}
                                                                max="9999-12-31"
                                                                selected={moment(details.trainingEndDate).format('YYYY-MM-DD')}
                                                                onChange={
                                                                    (e) => {
                                                                        setFieldValue('trainingEndDate', e.target.value);

                                                                        setDetails({
                                                                            ...details,
                                                                            trainingEndDate: e.target.value
                                                                        });
                                                                    }
                                                                }
                                                            />
                                                            <ErrorMessage className={`${touched.trainingEndDate && errors.trainingEndDate ? "invalid-text" : ""
                                                                }`} name="trainingEndDate" component="div" />
                                                        </div>
                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainingMeetingLink'>
                                                                Meeting Link
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                component='textarea'
                                                                name='trainingMeetingLink'
                                                                className='form-control'
                                                                placeholder='Meeting Link'
                                                            />
                                                            <ErrorMessage className={`${touched.trainingMeetingLink && errors.trainingMeetingLink ? "invalid-text" : ""
                                                                }`} name="trainingMeetingLink" component="div" />
                                                        </div>
                                                        <div className='up col-md-6'>
                                                            <label className='label-profile' htmlFor='description'>
                                                                Description <span className="desc" >
                                                                </span>
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                component='textarea'
                                                                name='description'
                                                                className='form-control'
                                                                placeholder='Description'
                                                            />
                                                            <ErrorMessage className={`${touched.description && errors.description ? "invalid-text" : ""
                                                                }`} name="description" component="div" />
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
                                                            />
                                                            <ErrorMessage className={`${touched.signatureName1 && errors.signatureName1 ? "invalid-text" : ""
                                                                }`} name="signatureName1" component="div" />

                                                        </div>
                                                        <div className='form-group col-md-6 '>


                                                            <label className='label-profile' htmlFor='signatureDesignation1'>
                                                                Designation I
                                                                <span className='asterix'>&nbsp;&#42;</span>

                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='signatureDesignation1'
                                                                className='form-control'
                                                                placeholder='Designation I '
                                                            />
                                                            <ErrorMessage className={`${touched.signatureDesignation1 && errors.signatureDesignation1 ? "invalid-text" : ""
                                                                }`} name="signatureDesignation1" component="div" />


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
                                                                placeholder='Signature II'
                                                            />
                                                            <ErrorMessage className={`${touched.signatureName2 && errors.signatureName2 ? "invalid-text" : ""
                                                                }`} name="signatureName2" component="div" />

                                                        </div>
                                                        <div className='form-group col-md-6'>

                                                            <label className='label-profile' htmlFor='signatureDesignation2'>
                                                                Designation II
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='signatureDesignation2'
                                                                className='form-control'
                                                                placeholder='Designation II'
                                                            />
                                                            <ErrorMessage className={`${touched.signatureDesignation2 && errors.signatureDesignation2 ? "invalid-text" : ""
                                                                }`} name="signatureDesignation2" component="div" />

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
                                                        <div className='form-group col-md-6 trainingSkillSelect'>
                                                            <label className='label-profile' htmlFor='skillsIds'>
                                                                Skills
                                                                <span className='asterix'>&nbsp;&#42;</span>

                                                            </label>
                                                            <Select
                                                                name="skillsIds"
                                                                value={preSelectedSkillsSet
                                                                    ? preSelectedSkillsSet.map(skill => ({
                                                                        label:
                                                                            skill.label,
                                                                        value: skill.value
                                                                    }))
                                                                    : []}
                                                                options={
                                                                    skillsSet
                                                                        ? skillsSet.map(skill => ({
                                                                            label:
                                                                                skill.name,
                                                                            value: skill.id
                                                                        }))
                                                                        : []
                                                                }
                                                                onChange={(items, option) => {
                                                                    console.log('option', option);
                                                                    if (option.removedValue && option.removedValue.isFixed) return;
                                                                    if (option.removedValue) {
                                                                        const newoptions = [...preSelectedSkillsSet].filter(item => item.value !== option.removedValue.value)
                                                                        setPreSelectedSkillsSet(newoptions);
                                                                        var ids = newoptions.map(item => {
                                                                            return item['value'];
                                                                        })
                                                                        console.log('preselected items after remove....................', newoptions);
                                                                        setFieldValue('skillsIds', ids);
                                                                    } else {
                                                                        var selectedSkills =
                                                                            Array.isArray(items) && items.length > 0
                                                                                ? items.map(item => {
                                                                                    return item['value'];
                                                                                })
                                                                                : [];
                                                                        setFieldValue('skillsIds', selectedSkills);
                                                                        console.log("selectedskillId....", selectedSkills);
                                                                        setPreSelectedSkillsSet([...preSelectedSkillsSet, option.option]);
                                                                        if (!selectedSkills.length) {
                                                                            details.skillsIds.length = 0;
                                                                            setPreSelectedSkillsSet([])
                                                                        }
                                                                    }
                                                                }}
                                                                isMulti
                                                                isClearable={!skillsSet.some(option => option.isFixed)} />
                                                            <ErrorMessage className={`${touched.skillsIds && errors.skillsIds ? "invalid-text" : ""
                                                                }`} name="skillsIds" component="div" />
                                                        </div>



                                                        <div className='col-md-12'>
                                                            <label className='labelnew' htmlFor='Logo'>
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
                                                            {/* <ErrorMessage className={`${touched.logoChange && errors.logo ? "invalid-text" : ""
                                                }`} name="logo" component="div" />       */}
                                                        </div>
                                                    </div>
                                                </div>



                                                <div className='clear'></div>
                                                <div className='ta-c save-button'>
                                                    <Link to="/training/list">
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
            )}

            {checkNoUrlParam() && (

                <Formik
                    initialValues={details}
                    validationSchema={TrainingNewSchema}
                    onSubmit={values => {
                        addNewTraining(values);
                    }}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <main className="">
                            <div id="mainContent">
                                <div className="container-fluid p-0">

                                    <Form className="pt-5 marg" encType="multipart/form-data">
                                        <h4 className="mB-20 text-center font-weight-bold page-title header-btn header-margin">
                                            ADD NEW TRAINING PROGRAM
                                        </h4>
                                        <hr className="mT-5 underline header-btn" />

                                        <Breadcrumb
                                            items={breadCrumbs}
                                        />
                                        <div className="settings-wrap mB-20">
                                            <h4 className="settings-head">Add Training Program</h4>
                                            <div className="p-r">
                                                <div className='pull-left half-width pR-15 pL-10 split'>
                                                    <div className='form-row'>


                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainingProgramName'>
                                                                Program Name
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='trainingProgramName'
                                                                className='form-control'
                                                                placeholder='Program Name '
                                                            />
                                                            <ErrorMessage className={`${touched.trainingProgramName && errors.trainingProgramName ? "invalid-text" : ""
                                                                }`} name="trainingProgramName" component="div" />
                                                        </div>

                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainersNames'>
                                                                Trainer Name
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='trainersNames'
                                                                className='form-control'
                                                                placeholder='Trainer Name'
                                                            />
                                                            <ErrorMessage className={`${touched.trainersNames && errors.trainersNames ? "invalid-text" : ""
                                                                }`} name="trainersNames" component="div" />
                                                        </div>
                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainersProfile'>
                                                                Trainer Profile
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='trainersProfile'
                                                                className='form-control'
                                                                placeholder='Trainer Profile'
                                                            />
                                                            <ErrorMessage className={`${touched.trainersProfile && errors.trainersProfile ? "invalid-text" : ""
                                                                }`} name="trainersProfile" component="div" />
                                                        </div>
                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='providedBy'>
                                                                Provided By
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                disabled
                                                                type='text'
                                                                name='providedBy'
                                                                className='form-control'
                                                                placeholder='Provided By'
                                                            />
                                                            <ErrorMessage className={`${touched.providedBy && errors.providedBy ? "invalid-text" : ""
                                                                }`} name="providedBy" component="div" />
                                                        </div>

                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainingStartDate'>
                                                                Start Date
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='date'
                                                                // defaultValue={moment(new Date()).format('YYYY-MM-DD')}
                                                                name='trainingStartDate'
                                                                className='form-control'
                                                                max={moment(details.trainingEndDate).format('YYYY-MM-DD')}
                                                                selected={moment(details.trainingStartDate).format('YYYY-MM-DD')}
                                                                onChange={
                                                                    (e) => {
                                                                        setFieldValue('trainingStartDate', e.target.value);

                                                                        setDetails({
                                                                            ...details,
                                                                            trainingStartDate: e.target.value
                                                                        });
                                                                    }
                                                                }
                                                            />
                                                            <ErrorMessage className={`${touched.trainingStartDate && errors.trainingStartDate ? "invalid-text" : ""
                                                                }`} name="trainingStartDate" component="div" />
                                                        </div>
                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainingEndDate'>
                                                                End Date
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='date'
                                                                // defaultValue={moment(new Date()).format('YYYY-MM-DD')}
                                                                name='trainingEndDate'
                                                                className='form-control'
                                                                min={moment(details.trainingStartDate).format('YYYY-MM-DD')}
                                                                max="9999-12-31"
                                                                selected={moment(details.trainingEndDate).format('YYYY-MM-DD')}
                                                                onChange={
                                                                    (e) => {
                                                                        setFieldValue('trainingEndDate', e.target.value);

                                                                        setDetails({
                                                                            ...details,
                                                                            trainingEndDate: e.target.value
                                                                        });
                                                                    }
                                                                }
                                                            />
                                                            <ErrorMessage className={`${touched.trainingEndDate && errors.trainingEndDate ? "invalid-text" : ""
                                                                }`} name="trainingEndDate" component="div" />
                                                        </div>
                                                        <div className='form-group col-md-6'>
                                                            <label className='label-profile' htmlFor='trainingMeetingLink'>
                                                                Meeting Link
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                component='textarea'
                                                                name='trainingMeetingLink'
                                                                className='form-control'
                                                                placeholder='Meeting Link'
                                                            />
                                                            <ErrorMessage className={`${touched.trainingMeetingLink && errors.trainingMeetingLink ? "invalid-text" : ""
                                                                }`} name="trainingMeetingLink" component="div" />
                                                        </div>
                                                        <div className='up col-md-6'>
                                                            <label className='label-profile' htmlFor='description'>
                                                                Description <span className="desc" >
                                                                </span>
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                component='textarea'
                                                                name='description'
                                                                className='form-control'
                                                                placeholder='Description'
                                                            />
                                                            <ErrorMessage className={`${touched.description && errors.description ? "invalid-text" : ""
                                                                }`} name="description" component="div" />
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
                                                            />
                                                            <ErrorMessage className={`${touched.signatureName1 && errors.signatureName1 ? "invalid-text" : ""
                                                                }`} name="signatureName1" component="div" />

                                                        </div>
                                                        <div className='form-group col-md-6 '>


                                                            <label className='label-profile' htmlFor='signatureDesignation1'>
                                                                Designation I
                                                                <span className='asterix'>&nbsp;&#42;</span>

                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='signatureDesignation1'
                                                                className='form-control'
                                                                placeholder='Designation I '
                                                            />
                                                            <ErrorMessage className={`${touched.signatureDesignation1 && errors.signatureDesignation1 ? "invalid-text" : ""
                                                                }`} name="signatureDesignation1" component="div" />


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
                                                                placeholder='Signature II'
                                                            />
                                                            <ErrorMessage className={`${touched.signatureName2 && errors.signatureName2 ? "invalid-text" : ""
                                                                }`} name="signatureName2" component="div" />

                                                        </div>
                                                        <div className='form-group col-md-6'>

                                                            <label className='label-profile' htmlFor='signatureDesignation2'>
                                                                Designation II
                                                                <span className='asterix'>&nbsp;&#42;</span>
                                                            </label>
                                                            <Field
                                                                type='text'
                                                                name='signatureDesignation2'
                                                                className='form-control'
                                                                placeholder='Designation II'
                                                            />
                                                            <ErrorMessage className={`${touched.signatureDesignation2 && errors.signatureDesignation2 ? "invalid-text" : ""
                                                                }`} name="signatureDesignation2" component="div" />

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
                                                        <div className='form-group col-md-6 trainingSkillSelect'>
                                                            <label className='label-profile' htmlFor='skillsIds'>
                                                                Skills
                                                                <span className='asterix'>&nbsp;&#42;</span>

                                                            </label>
                                                            <Select
                                                                name="skillsIds"
                                                                value={preSelectedSkillsSet
                                                                    ? preSelectedSkillsSet.map(skill => ({
                                                                        label:
                                                                            skill.label,
                                                                        value: skill.value
                                                                    }))
                                                                    : []}
                                                                options={
                                                                    skillsSet
                                                                        ? skillsSet.map(skill => ({
                                                                            label:
                                                                                skill.name,
                                                                            value: skill.id
                                                                        }))
                                                                        : []
                                                                }
                                                                onChange={(items, option) => {
                                                                    console.log('option', option);
                                                                    if (option.removedValue && option.removedValue.isFixed) return;
                                                                    if (option.removedValue) {
                                                                        const newoptions = [...preSelectedSkillsSet].filter(item => item.value !== option.removedValue.value)
                                                                        setPreSelectedSkillsSet(newoptions);
                                                                        var ids = newoptions.map(item => {
                                                                            return item['value'];
                                                                        })
                                                                        console.log('preselected items after remove....................', newoptions);
                                                                        setFieldValue('skillsIds', ids);



                                                                    } else {
                                                                        var selectedSkills =
                                                                            Array.isArray(items) && items.length > 0
                                                                                ? items.map(item => {
                                                                                    return item['value'];
                                                                                })
                                                                                : [];
                                                                        setFieldValue('skillsIds', selectedSkills);
                                                                        console.log("selectedskillId....", selectedSkills);
                                                                        setPreSelectedSkillsSet([...preSelectedSkillsSet, option.option]);
                                                                        if (!selectedSkills.length) {
                                                                            details.skillsIds.length = 0;
                                                                            setPreSelectedSkillsSet([])
                                                                        }

                                                                    }



                                                                }}

                                                                isMulti

                                                                isClearable={!skillsSet.some(option => option.isFixed)} />
                                                            {/* <Field
                                                name="skillsIds"
                                                component={SelectField}
                                                options={
                                                    skillsSet
                                                    ? skillsSet.map(skill => ({
                                                        label:
                                                        skill.name,
                                                        value: skill.id
                                                    }))
                                                    : []
                                                }
                                            /> */}

                                                            <ErrorMessage className={`${touched.skillsIds && errors.skillsIds ? "invalid-text" : ""
                                                                }`} name="skillsIds" component="div" />
                                                        </div>



                                                        <div className='col-md-12'>
                                                            <label className='labelnew' htmlFor='Logo'>
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
                                                            {/* <ErrorMessage className={`${touched.logoChange && errors.logo ? "invalid-text" : ""
                                                }`} name="logo" component="div" />       */}
                                                        </div>







                                                    </div>
                                                </div>



                                                <div className='clear'></div>
                                                <div className='ta-c save-button'>
                                                    <Link to="/training/list">
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
            )}

            <div className={buttonStyle}>

                <div className="settings-wrap mB-20 marg ">
                    <h4 className="settings-head">Upload Schedule File</h4>
                    <div className="p-r2">


                        <div className='form-row'>
                            <div className='col-md-6'>
                                <label className='label-profile' htmlFor='signature1'>
                                    Schedule File<span className='asterix'>&nbsp;&#42;</span>
                                </label>
                                <InputFile

                                    fileChange={val => {
                                        setpgmScheduleFile('');
                                        console.log('file value...', val);
                                        setpgmSchedule(val);
                                    }}
                                    name="pgmScheduleFile"
                                    defaultValue={pgmScheduleFile}
                                    isEnableUploadBtn="true"
                                    uploadBtnValue={textResources.UPLOAD}
                                    uploadBtnOnClick={uploadPgmSchedule}
                                    uploadTick={getschedule}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-wrap mB-20 marg">
                    <h4 className="settings-head">Upload Signature</h4>
                    <div className="p-r2">



                        <div className='form-row'>
                            <div className='col-md-6'>
                                <label className='label-profile' htmlFor='signature1'>
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
            </div>
        </div>
    )
}

export default TemplateLayoutHOC(
    CheckPermission(TrainingNew)(['training-create'], ['COMPANY'])
);
