import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FAIcon from '../Common/FAIcon';
// import DataTable from '../Common/DataTable';
// import { Table } from '../Includes/Table';
import TableFooter from '../Includes/TableFooter';
import {  useDispatch, useSelector } from 'react-redux';
import TemplateLayoutHOC from '../Pages/TemplateLayoutHOC';
// import textResources from '../../constants/app-strings';
import swal from 'sweetalert';
import { showLoader, hideLoader, showSnackbar, closeModal, openModal } from '../../actions/ui';
import { TrainingService } from '../../services/award-service';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from 'react-responsive-modal';
//import Checkbox from 'react-simple-checkbox';
import { history } from '../../routers/AppRouter';
// import { useParams } from 'react-router-dom';
//import Checkbox from 'react-simple-checkbox'; 
import Moment from 'react-moment';
//import {  ModalFooter, Button } from "reactstrap"; 
import PageWrapper from '../Includes/PageWrapper';
import {
    getParameter,
    checkPermissions,
    updateQueryStringParameter,
    filterFocus
} from '../../utils/utilities';
import pickBy from 'lodash/pickBy';
import {
    resetFilters,
    setPaginationFilter,
    setPagination,
    // setParticipantsPagination,
    setParticipantsPaginationFilter
} from '../../actions/dataTable';
import InputFile from '../Common/InputFile';
import CheckPermission from '../Pages/CheckPermission';
//import { checkPermissions } from '../../utils/utilities';


const AwardList = () => {
    // const { id } = useParams();
    const dispatch = useDispatch();
    let [trainings, setTrainings] = useState([]);
    // const [skills, setSkills] = useState([]);
    // const [attendesIdList, setAttendeesIdList] = useState([]);
    const [participants, setParticipants] = useState([]);
    const open = useSelector(state => state.ui.showModal);
    const [selectedTrainingProgramId, setSelectedTrainingProgramId] = useState();
    const [file, setFile] = useState();
    const [selectAll, setselectAll] = useState([]);
    // const [TrainingProgramid, setTrainingProgramid] = useState();
    const [participantsFilepath, setParticipantsFilepath] = useState();
    // const [sampleFilepath, setSampleFilepath] = useState();
    const pagination = useSelector(state => state.dataTable.pagination);
    const [totalCount, setTotalCount] = useState();
    const filters = useSelector(state => state.dataTable.filters);
    const queryParams = getParameter();
    // const [participantsTotalCount, setParticipantsTotalCount] = useState();
    const participantsPagination = useSelector(state => state.dataTable.participantsPagination);
    // const [participantsPagination, setParticipantsPagination] = useState([]);
    const [upload, setUpload] = useState();
    const [status, setStatus] = useState([]);
    let userType;
    let permissions;
    if (JSON.parse(localStorage.getItem('auth')) !== null) {
        userType = JSON.parse(localStorage.getItem('auth')).type;
        permissions = JSON.parse(localStorage.getItem('auth')).permissions;
    }


    let initialVal = {
        awardTitle: '',
        description: '',
        issueDate: '',
        status: ''
    };



    useEffect(() => {
        dispatch(resetFilters());
        if (queryParams.skip && queryParams.limit && queryParams.page) {
            dispatch(
                setPaginationFilter(
                    {
                        skip: parseInt(queryParams.skip) || 0,
                        limit: parseInt(queryParams.limit) || 10,
                        currentPage: parseInt(queryParams.page) || 1
                    },
                    {
                        awardTitle: queryParams.awardTitle,
                        description: queryParams.description,
                        issueDate: queryParams.issueDate,
                        status: queryParams.status,

                        oawardTitle: queryParams.oawardTitle,
                        odescription: queryParams.odescription,
                        oissueDate: queryParams.oissueDate,
                        ostatus: queryParams.ostatus
                    }
                )
            );
        }
    }, [dispatch]);

    useEffect(() => {
        getTrainingPrograms();
        getStatus();
    }, [filters, pagination]);



    useEffect(() => {
        filterFocus(pickBy(filters));
    }, [filters]);

    useEffect(() => {
        return () => {
            dispatch(setPaginationFilter({}, {}));
            dispatch(setParticipantsPaginationFilter({}, {}));
        };
    }, []);


    // const handleFileChange = event => {
    //     const files = event.target.files;
    //     setFile(files[0]);
    // };
    const uploadTrainingAttendees = async () => {
        // console.log('id................. ', selectedTrainingProgramId);
        try {
            dispatch(showLoader());
            if (upload) {
                //console.log('fileupload123', file);
                let formData = new FormData();
                formData.append('file', upload);
                formData.append('id', selectedTrainingProgramId);
                formData.append('forceDelete', false);
    
                // console.log('formData fs', formData);
                const responseData = await TrainingService.uploadAttendees(formData);
                if (responseData.data.responseMessage === 'Successfully uploaded.') {
                    dispatch(closeModal('uploadAttendeesModal'));
                    setTimeout(() => {
                        history.push('/award/list');
                    }, 900)
                    dispatch(showSnackbar({
                        message: 'Successfully Uploaded',
                        type: "success"
                    }));
                }
    
                // console.log('responseData', responseData);
                else if (responseData.data.responseMessage === 'participants exists') {
                    //console.log('responseData.responseMessage', responseData.responseMessage);
                    swal(`Previously added award winners will remove. Do you want to upload again?`, {
                        buttons: {
                            cancel: "No",
                            delete: {
                                text: "Yes",
                                value: "yes",
                            }
                        },
                    })
                        .then((value) => {
                            switch (value) {
                                case "yes":
                                    let formData2 = new FormData();
                                    formData2.append('file', file);
                                    formData2.append('id', selectedTrainingProgramId);
                                    formData2.append('forceDelete', true);
                                    TrainingService.uploadAttendees(formData2);
    
                                    dispatch(closeModal('uploadAttendeesModal'));
                                    setTimeout(() => {
                                        history.push('/award/list');
                                    }, 900)
                                    dispatch(showSnackbar({
                                        message: 'Successfully Uploaded',
                                        type: "success"
                                    }));
    
                                    break;
                                case "No":
                                    console.log("Case NO");
                                    break;
                                default:
                                    console.log("Default Case");    
                            }
                            dispatch(showSnackbar({
                                message: 'Successfully Uploaded',
                                type: "success"
                            }));
    
                        });
                }
    
                else if (responseData.data.responseMessage === 'error') {
                    dispatch(showSnackbar({
                        message: 'Email Id should be unique',
                        type: "error"
                    }));
                    //dispatch(closeModal('uploadAttendeesModal'));
                }
    
                else if (responseData.data.responseMessage === 'cell') {
                    dispatch(showSnackbar({
                        message: 'Cell is empty',
                        type: "error"
                    }));
                    //dispatch(closeModal('uploadAttendeesModal'));
                }
    
                else if (responseData.data.responseMessage === 'list') {
                    dispatch(showSnackbar({
                        message: 'List is empty',
                        type: "error"
                    }));
                   // dispatch(closeModal('uploadAttendeesModal'));
                }
    
                else if (responseData.data.responseMessage === 'file') {
                    console.log(responseData);
                    dispatch(showSnackbar({
                        message: 'Allowed file types are .xlsx,.xls,.csv',
                        type: "error"
                    }));
                   // dispatch(closeModal('uploadAttendeesModal'));
                }
    
                else if (responseData.data.responseMessage === 'isNum') {
                    dispatch(showSnackbar({
                        message: 'Mobile number can only have numbers',
                        type: "error"
                    }));
                   // dispatch(closeModal('uploadAttendeesModal'));
                }
    
                else if (responseData.data.responseMessage === 'strLen') {
                    dispatch(showSnackbar({
                        message: 'Mobile number must be greater than 7 and lesser than 15 characters',
                        type: "error"
                    }));
                   // dispatch(closeModal('uploadAttendeesModal'));
                }
    
                else if (responseData.data.responseMessage === 'isChar') {
                    dispatch(showSnackbar({
                        message: 'Name can only contain alphabets',
                        type: "error"
                    }));
                   // dispatch(closeModal('uploadAttendeesModal'));
                }
    
                else if (responseData.data.responseMessage === 'isMail') {
                    dispatch(showSnackbar({
                        message: 'Email Id is invalid',
                        type: "error"
                    }));
                  //  dispatch(closeModal('uploadAttendeesModal'));
                }
                else{
                    console.log('error in upload!!!!!!!!!!!!!!!!!!!!!!!');
                    
                }
                document.getElementById("uploadAwards").value = "";
                //document.getElementById("txt-uploadAwards").value = ""; 
            }
            dispatch(hideLoader());

        } catch (error) {
            dispatch(hideLoader());
            console.log('error in upload!!!!!!!!!!!!!!!!!!!!!!!', error); 
        }
        
    };

    const fetchTrainings = async (requestData) => {
        try {
            dispatch(showLoader());
            let { data } = await TrainingService.getAllTrainings(requestData);
            setTrainings(data.data);
            setTotalCount(data.count);
            dispatch(hideLoader());

        } catch (error) {
            dispatch(hideLoader());
        }

    }

    const download = async () => {
        try {
            dispatch(showLoader());
            const param =
                (pagination && pagination.skip
                    ? '&skip=' + pagination.skip
                    : '&skip=0') +
                (pagination && pagination.limit
                    ? '&limit=' + pagination.limit
                    : '&limit=10') +
                (filters.awardTitle ? '&awardTitle=' + filters.awardTitle : '') +
                (filters.description ? '&description=' + filters.description : '') +
                (filters.issueDate ? '&issueDate=' + filters.issueDate : '') +
                (filters.status ? '&status=' + filters.status : '') +

                (filters.oawardTitle ? '&oawardTitle=' + filters.oawardTitle : '') +
                (filters.odescription ? '&odescription=' + filters.odescription : '') +
                (filters.oissueDate ? '&oissueDate=' + filters.oissueDate : '') +
                (filters.ostatus ? '&ostatus=' + filters.ostatus : '');
            let { data } = await TrainingService.downloadPdfList(param);
            setTrainings(data.data);
            dispatch(hideLoader());

        } catch (error) {
            dispatch(hideLoader());
        }

    }

    const preview = async () => {
        try {
            dispatch(showLoader());
            const param =
                (pagination && pagination.skip
                    ? '&skip=' + pagination.skip
                    : '&skip=0') +
                (pagination && pagination.limit
                    ? '&limit=' + pagination.limit
                    : '&limit=10') +
                (filters.awardTitle ? '&awardTitle=' + filters.awardTitle : '') +
                (filters.description ? '&description=' + filters.description : '') +
                (filters.issueDate ? '&issueDate=' + filters.issueDate : '') +
                (filters.status ? '&status=' + filters.status : '') +

                (filters.oawardTitle ? '&oawardTitle=' + filters.oawardTitle : '') +
                (filters.odescription ? '&odescription=' + filters.odescription : '') +
                (filters.oissueDate ? '&oissueDate=' + filters.oissueDate : '') +
                (filters.ostatus ? '&ostatus=' + filters.ostatus : '');
            let { data } = await TrainingService.downloadPreviewList(param);
            setTrainings(data.data);
            dispatch(hideLoader());

        } catch (error) {
            dispatch(hideLoader());
        }

    }

    const downloadCsv = async () => {
        try {
            dispatch(showLoader());
            const param =
                (pagination && pagination.skip
                    ? '&skip=' + pagination.skip
                    : '&skip=0') +
                (pagination && pagination.limit
                    ? '&limit=' + pagination.limit
                    : '&limit=10') +
                (filters.awardTitle ? '&awardTitle=' + filters.awardTitle : '') +
                (filters.description ? '&description=' + filters.description : '') +
                (filters.issueDate ? '&issueDate=' + filters.issueDate : '') +
                (filters.status ? '&status=' + filters.status : '') +

                (filters.oawardTitle ? '&oawardTitle=' + filters.oawardTitle : '') +
                (filters.odescription ? '&odescription=' + filters.odescription : '') +
                (filters.oissueDate ? '&oissueDate=' + filters.oissueDate : '') +
                (filters.ostatus ? '&ostatus=' + filters.ostatus : '');
            let { data } = await TrainingService.downloadCsvList(param);
            setTrainings(data.data);
            dispatch(hideLoader());

        } catch (error) {
            dispatch(hideLoader());
        }

    }

    const downloadZip = async (id) => {
        try {
            dispatch(showLoader());
            let { data } = await TrainingService.downloadZipFile(id);
            setTrainings(data.data);
            dispatch(hideLoader());
        } catch (error) {
            dispatch(hideLoader());
        }

    }

    const asyncDelete = async (idToBeRemoved) => {
        try {
            dispatch(showLoader());
            let { data } = await TrainingService.deleteProgram(idToBeRemoved);
            dispatch(hideLoader());
            dispatch(showSnackbar({
                message: data.responseMessage,
                type: "success"
            }));
            window.location.reload(false);
            // history.push('/award/list');
            //removecomment //setTrainings(employees.filter(item => item.id !== idToBeRemoved))

        } catch (error) {
            dispatch(hideLoader())
            dispatch(showSnackbar({
                message: error.response.data.responseMessage,
                type: "error"
            }));
        }
    }

    const confirmDelete = (details) => {
        swal(`Are You Sure, you want to delete ${details.awardTitle}?`, {
            buttons: {
                cancel: "No",
                delete: {
                    text: "Yes",
                    value: "yes",
                }
            },
        })
            .then((value) => {
                switch (value) {
                    case "yes":
                        asyncDelete(details.id);
                        break;
                    case "No":
                        console.log("Case No");
                        break;
                    default:
                        console.log("Default Case")
                }
            });
    }

    const uploadAttendees = (details, filename) => {
        setSelectedTrainingProgramId(details.id);
        console.log("Filename===>", filename);
        setParticipantsFilepath(filename);
        dispatch(openModal('uploadAttendeesModal'));
    }
    const showParticipants = (details, filename1) => {
        console.log("filename....", filename1);
        setSelectedTrainingProgramId(details.id);
        const param =
            (participantsPagination && participantsPagination.skip
                ? '&skip=' + participantsPagination.skip
                : '&skip=0') +
            (participantsPagination && participantsPagination.limit
                ? '&limit=' + participantsPagination.limit
                : '&limit=10') +
            '&id=' + details.id;
        fetchParticipants(param, 'showParticipants');
        if (filename1 == 0 || filename1 === null) {
            const extnsn = 'Sample.xlsx';
            setParticipantsFilepath(extnsn);
            console.log("hello.....", filename1);
        } else {
            setParticipantsFilepath(filename1);
            // setSampleFilepath(filename1);
        }
        // console.log('filename',filename1);
        dispatch(openModal('viewParticipantsModal'));
    }
    const fetchParticipants = async (param, caller) => {
        try {
            console.log('fetchParticipants caled by ============================================================', caller);
            dispatch(showLoader());

            let { data } = await TrainingService.fetchParticipants(param);
            console.log('id of download csv after', selectedTrainingProgramId)
            setParticipants(data.data);
            //setParticipantsPagination(data.data);
            // setParticipantsTotalCount(data.count);
            dispatch(hideLoader());
        } catch (error) {
            dispatch(hideLoader());
        }

    }
    // const viewSkills = (details) => {
    //     fetchSkills(details.id);
    //     dispatch(openModal('viewSkillsModal'));
    // }
    // const fetchSkills = async (id) => {
    //     try {
    //         dispatch(showLoader());
    //         let { data } = await TrainingService.fetchSkills(id);
    //         setSkills(data.data);
    //         dispatch(hideLoader());

    //     } catch (error) {
    //         dispatch(hideLoader());
    //     }

    // }
    const sendCertificate = (details) => {
        setSelectedTrainingProgramId(details.id);
        const param =
            (participantsPagination && participantsPagination.skip
                ? '&skip=' + participantsPagination.skip
                : '&skip=0') +
            (participantsPagination && participantsPagination.limit
                ? '&limit=' + participantsPagination.limit
                : '&limit=10') +
            '&id=' + details.id;
        fetchParticipants(param, 'sendCertificate');

        dispatch(openModal('sendCertificateModal'));

    }
    const sendCertificateId = (e, memberId) => {
        const target = e.target;
        //const value = parseInt(target.value);

        if (target.checked) {
            // attendesIdList.push(value);
            console.log("inside if ===============================", selectAll);
            setselectAll([...selectAll, memberId])
        } else {
            setselectAll([...selectAll].filter(item => item !== memberId))
            console.log('inside else ===============================', memberId);
            console.log('before removing id from list', selectAll);
            // attendesIdList.splice(attendesIdList.indexOf(participants.map(item => item.memberId == memberId)), 1);
            console.log("after removed list..", selectAll);

        }
        console.log("outside ifelse========", selectAll)
    }
    //console.log('selectall',selectAll);
    const sendCertificateMail = async () => {
        try {
            dispatch(showLoader());
            console.log("is send to..", selectAll);
            TrainingService.mailTo(selectAll);
            dispatch(hideLoader());
            dispatch(showSnackbar({
                message: "Notification Sent",
                type: "success"
            }));
            dispatch(closeModal('sendCertificateModal'))
            // attendesIdList.length = 0;
            setselectAll([])

        } catch (error) {
            dispatch(hideLoader())
            dispatch(showSnackbar({
                message: "Error",
                type: "error"
            }));
        }
    }

    // const downloadScheduleFile = async (id, filename) => {
    //     try {
    //         dispatch(showLoader());
    //         let { data } = await TrainingService.downloadScheduleFile(id, filename);
    //         setTrainings(data.data);
    //         dispatch(hideLoader());
    //     } catch (error) {
    //         dispatch(hideLoader());
    //     }

    // }
    const changeselectAll = (event, a) => {
        // console.log('eeee', participants.map(item => item.id));
        if (event.target.checked) {
            setselectAll(participants.map(item => item.id))
            //attendesIdList.push(participants.map(item => item.id));
            console.log('idlist', selectAll);
        }
        else {
            setselectAll([])
            // attendesIdList.push([]);
            //console.log('item.id', attendesIdList.indexOf(participants.map(item => item.id)))
            // attendesIdList.splice(attendesIdList.indexOf(participants.map(item => item.id)), 1);
            console.log('idlist', selectAll);
        }
    }

    const downloadParticipantsFile = async (selectedTrainingProgramIds, participantsFilepaths) => {
        try {
            // console.log('filename2',participantsFilepath);
            //console.log('download csv', selectedTrainingProgramId);
            dispatch(showLoader());
             await TrainingService.downloadParticipantsFile(selectedTrainingProgramIds, participantsFilepaths);
            //setTrainings(data.data);
            dispatch(hideLoader());
        } catch (error) {
            dispatch(hideLoader());
        }

    }

    const searchParticipants = async (search) => {
        console.log('search', search, selectedTrainingProgramId);
        let payload = search ? search : '';
        console.log('payload', payload);
        //const selectedTrainingProgramId = 2;
        try {
            dispatch(showLoader());
            let { data } = await TrainingService.searchParticipants({ search: payload, selectedTrainingProgramId });
            setParticipants(data.data);
            dispatch(hideLoader());

        } catch (error) {
            dispatch(hideLoader());
        }

    }


    const handleChange = data => {
        console.log('handleChange................................................>>>>>>>>>>', data);
        let newURI = updateQueryStringParameter(
            history.location.pathname + history.location.search,
            ['skip', 'limit', 'page'],
            [data.skip, data.limit, data.currentPage]
        );

        history.replace(newURI);
        console.log('newURI..............', newURI);
        dispatch(setPagination(data));
    };


    // const handleChangeParticipants = data => {
    //     console.log('handleChangeParticipants...................................................>>>>>>>>>>>', data);
    //     dispatch(setParticipantsPagination(data));
    //     const param =
    //         (data && data.skip
    //             ? '&skip=' + data.skip
    //             : '&skip=0') +
    //         (data && data.limit
    //             ? '&limit=' + data.limit
    //             : '&limit=10') +
    //         '&id=' + selectedTrainingProgramId;
    //     fetchParticipants(param, 'handleChangeParticipants');
    // };

    const getStatus = async () => {
        const { data } = await TrainingService.getAllStatus(
            { search: "" }
        )
        // console.log('data........',data);
        let statusList = data.data.map(item => {
            let statusObj = {
                name: item['enumValue'],
                value: item['enumValue']
            }
            return statusObj;
        })
        setStatus(statusList);
    }

    const buttons = [
        {
            btnClass: 'btn btn-outline-primary btn-lg mL-10 pull-right',
            btnTitle: 'Download CSV',
            btnRoute: '',
            iconClass: 'fas fa-file-csv header-btn',
            type: 'button',
            btnDisable:
                trainings &&
                Array.isArray(trainings) &&
                trainings.length === 0,
            clickFn: () => {
                downloadCsv()
            }

        },
        {
            btnClass: 'btn btn-outline-primary btn-lg mL-10 pull-right',
            btnTitle: 'Download PDF',
            btnRoute: '',
            iconClass: 'fas fa-file-pdf header-btn',
            type: 'button',
            btnDisable:
                trainings &&
                Array.isArray(trainings) &&
                trainings.length === 0,
            clickFn: () => {
                download()
            }

        },
        {
            btnClass: 'btn btn-outline-primary btn-lg mL-10 pull-right',
            btnTitle: 'Print',
            btnRoute: '',
            iconClass: 'fas fa-print header-btn',
            type: 'button',
            btnDisable:
                trainings &&
                Array.isArray(trainings) &&
                trainings.length === 0,
            clickFn: () => {
                preview()
            }

        },
        {
            btnClass: 'btn btn-outline-primary btn-lg mL-10 pull-right',
            btnTitle: 'Add New Award',
            btnRoute: '/award/add-new',
            iconClass: 'fas fa-plus header-btn',
            type: 'button-link',
            btnHide: !checkPermissions(permissions, userType, ['awards-create'], ['COMPANY'])

        }
    ];



    const filterColumns = [
        {
            columnName: 'Title',
            apiField: 'awardTitle',
            apiOrderField: 'oawardTitle',
            type: 'text'
        },
        {
            columnName: 'Description',
            apiField: 'description',
            apiOrderField: 'odescription',
            type: 'text'
        },
        {
            columnName: 'Issue Date',
            apiField: 'issueDate',
            apiOrderField: 'oissueDate',
            type: 'date'
        },
        {
            columnName: 'Status',
            apiField: 'status',
            apiOrderField: 'ostatus',
            type: 'select',
            options: status
        }
    ];

    function getTrainingPrograms() {
        //  if (pagination.skip !== undefined) {
        const param =
            (pagination && pagination.skip
                ? '&skip=' + pagination.skip
                : '&skip=0') +
            (pagination && pagination.limit
                ? '&limit=' + pagination.limit
                : '&limit=10') +
            (filters.awardTitle ? '&awardTitle=' + filters.awardTitle : '') +
            (filters.description ? '&description=' + filters.description : '') +
            (filters.issueDate ? '&issueDate=' + filters.issueDate : '') +
            (filters.status ? '&status=' + filters.status : '') +

            (filters.oawardTitle ? '&oawardTitle=' + filters.oawardTitle : '') +
            (filters.odescription ? '&odescription=' + filters.odescription : '') +
            (filters.oissueDate ? '&oissueDate=' + filters.oissueDate : '') +
            (filters.ostatus ? '&ostatus=' + filters.ostatus : '');

        console.log('get training list param ', param);
        fetchTrainings(param);
        //}
    }
    return (
        <>
            <div>

                <main className='main-content bgc-grey-100'>
                    <Modal
                        open={open.includes('uploadAttendeesModal')}
                        onClose={() => dispatch(closeModal('uploadAttendeesModal'))}
                        center
                        classNames={{
                            closeIcon: 'fill-grey-600',
                            closeButton: 'close-brdr skill-add-modal-close',
                            modal: 'custom-modal max-w-800 head-padd2'
                        }}
                        closeIconSize={20}
                    >
                        <div className="modal-header bgc-white bgc-grey-100 head-padd">
                            <h3 className="c-grey-900 mB-20 heading"> Upload Award Winners</h3>


                        </div>
                        <div className="modal-body-new bgc-white">
                            <div className="form-group">
                                <div className="group">
                                    <div className="input-group-btn">
                                        <span className="">
                                            <span className="upl" id="upload">

                                            </span>


                                            <div>
                                                Please download the latest file and modify before upload
                                                <button
                                                    className='btn head-icon font-icons'

                                                    onClick={() =>
                                                        downloadParticipantsFile(selectedTrainingProgramId, participantsFilepath)
                                                    }
                                                >
                                                    <i class="fas fa-file-csv"></i>
                                                    <FAIcon
                                                        iconName='file-csv'
                                                        className='fas fa-file-csv'
                                                    />
                                                    &nbsp;&nbsp;
                                                </button>

                                            </div>
                                            <InputFile
                                            id="uploadAwards"
                                                acceptType=".xlsx,.xls,.csv"
                                                fileChange={val => {
                                                    console.log('file value...', val);
                                                    setUpload(val);
                                                    setFile(val);
                                                    setParticipantsFilepath(val.name);
                                                }}
                                                name="upload"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bgc-white">
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => dispatch(closeModal('uploadAttendeesModal'))}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={uploadTrainingAttendees}
                            >
                                Save changes
                            </button>
                        </div>
                    </Modal>
                    <Modal
                        open={open.includes('viewParticipantsModal')}
                        onClose={() => dispatch(closeModal('viewParticipantsModal'))}
                        center
                        classNames={{
                            closeIcon: 'fill-grey-600',
                            closeButton: 'close-brdr skill-add-modal-close',
                            modal: 'custom-modal max-w-800 head-padd2'
                        }}
                        closeIconSize={20}
                    >
                        <div className="modal-header bgc-white head-padd">
                            <h3 className="c-grey-900 mB-20 heading">Award Winners</h3>
                        </div>

                        <div className="modal-body bgc-white">
                            <div className="table-responsive">
                                <div className="row mb-2">

                                    <div className="col-md-4">
                                        <input onChange={(e) => {
                                            searchParticipants(e.target.value);
                                        }} placeholder="Search Award Winners " className="form-control" />
                                    </div>
                                    <div className="rightal">
                                        Download the winners list
                                        <button
                                            className='btn head-icon font-icons '

                                            onClick={() =>
                                                downloadParticipantsFile(selectedTrainingProgramId, participantsFilepath)
                                            }
                                        >
                                            <i class="fas fa-file-csv"></i>
                                            <FAIcon
                                                iconName='file-csv'
                                                className='fas fa-file-csv'
                                            />
                                            &nbsp;&nbsp;
                                        </button>

                                    </div>


                                </div>

                                <table className="table table-striped-maintable">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">
                                                <span className="pull-left">Name</span>
                                            </th>
                                            <th scope="col">
                                                <span className="pull-left">Email</span>
                                            </th>
                                            <th scope="col">
                                                <span className="pull-left">Phone Number</span>
                                            </th>
                                            <th scope="col">
                                                <span className="pull-left">Designation</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participants &&
                                            Array.isArray(participants) &&
                                            participants.length > 0 &&
                                            participants.map((member, index) => (
                                                <tr key={'team-member-' + member.id}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{member.name}</td>
                                                    <td>
                                                        <span className='grey'>
                                                            <i>
                                                                <FAIcon iconName='envelope' className='fas fa-envelope' />
                                                            </i>
                                                        </span>&nbsp;
                                                        <a
                                                            href={'mailto:' + member.email}
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                        >
                                                            {member.email}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <span className='grey'>
                                                            <i>
                                                                <FAIcon iconName='mobile' className='fa fa-mobile' />
                                                            </i>
                                                        </span>&nbsp;
                                                        <a
                                                            href={
                                                                'https://api.whatsapp.com/send?phone=' +
                                                                member.phoneNumber
                                                            }
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                        >
                                                            {member.phoneNumber}
                                                        </a>
                                                    </td>
                                                    <td>{member.designation}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                {/* {participantsTotalCount > 0 && (
                    <TableFooter
                    count={participantsTotalCount}
                    handleChange={handleChangeParticipants}
                    currentPage={queryParams.page}
                    />
                )} */}
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        open={open.includes('sendCertificateModal')}
                        onClose={() => dispatch(closeModal('sendCertificateModal'), setselectAll([]))}
                        center
                        classNames={{
                            closeIcon: 'fill-grey-600',
                            closeButton: 'close-brdr skill-add-modal-close',
                            modal: 'custom-modal max-w-800 head-padd2'
                        }}
                        closeIconSize={20}
                    >

                        <div className="modal-header bgc-white head-padd">
                            <h3 className="c-grey-900 mB-20 heading">Send Award</h3>
                        </div>
                        <div className="modal-body bgc-white">

                            <div className="table-responsive">
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <input onChange={(e) => {
                                            searchParticipants(e.target.value);
                                        }} placeholder="Search Award Winners " className="form-control" />
                                    </div>
                                </div>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <span className="pull-left">
                                                    <input type='checkbox' name='selectAll' onChange={changeselectAll} />
                                                    &nbsp; Select All
                                                </span>
                                            </th>
                                            <th scope="col">
                                                <span className="pull-left">Name</span>
                                            </th>
                                            <th scope="col">
                                                <span className="pull-left">Email</span>
                                            </th>
                                            <th scope="col">
                                                <span className="pull-left">Phone Number</span>
                                            </th>
                                            <th scope="col">
                                                <span className="pull-left">Designation</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {participants &&
                                            Array.isArray(participants) &&
                                            participants.length > 0 &&
                                            participants.map((member, index) => (
                                                <tr>

                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectAll.indexOf(member.id) > -1}
                                                            value={member.id}
                                                            onChange={(event) => sendCertificateId(event, member.id)}
                                                        /> &nbsp;&nbsp;
                                                        <b>{index + 1}</b>
                                                    </td>
                                                    <td>{member.name}</td>
                                                    <td>{member.email}</td>
                                                    <td>{member.phoneNumber}</td>
                                                    <td>{member.designation}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                {/* {participantsTotalCount > 0 && (
                    <TableFooter
                    count={participantsTotalCount}
                    handleChange={handleChangeParticipants}
                    currentPage={queryParams.page}
                    />
                )} */}
                            </div>

                        </div>
                        <div className="modal-footer bgc-white">
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => dispatch(closeModal('sendCertificateModal'), setselectAll([]))}

                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => sendCertificateMail()}
                            >
                                Send
                            </button>
                        </div>

                    </Modal>


                    <PageWrapper
                        pageTitle="AWARDS ISSUED"
                        buttons={buttons}
                        filter={true}
                        filterColumns={filterColumns}
                        initialVal={initialVal}
                    >
                        <div className='clear'></div>

                        <div className="table-responsive po-table">
                            <table className="table table-striped maintable" id="po-table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">
                                            <span className="pull-left"> Title</span>
                                        </th>
                                        <th scope="col">
                                            <span className="pull-left"> Description</span>
                                        </th>
                                        <th scope="col">
                                            <span className="pull-left"> Issued Date</span>
                                        </th>
                                        <th scope="col">
                                            <span className="pull-left"> Status</span>
                                        </th>
                                        <th scope="col">
                                            <span className=""> Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trainings &&
                                        Array.isArray(trainings) &&
                                        trainings.length > 0 &&
                                        trainings.map((training, index) => {
                                            return (
                                                <tr key={'training-' + training.id}>
                                                    <th scope="row">{pagination && pagination.skip
                                                        ? pagination.skip + index + 1
                                                        : index + 1}</th>
                                                    <td>{training.awardTitle}</td>
                                                    <td>{training.description}</td>
                                                    <td>
                                                        {training.issueDate ? (
                                                            <span className='mobile profile-value'>
                                                                <Moment format='DD-MMM-YYYY'>{training.issueDate}</Moment>
                                                            </span>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </td>
                                                    <td>{training.enumValue}</td>
                                                    <td className="list-padd">
                                                        <div>
                                                            <div className="d-flex justify-content-start">
                                                                {checkPermissions(permissions, userType, ['awards-update'], ['COMPANY']) && (
                                                                    <Tooltip title="Edit Award">
                                                                        <Link className="btn btn-sm btn-outline-info ml-2 mt-2" to={`/award/${training.id}/edit`}>
                                                                            <i className='fas fa-pen'></i>
                                                                        </Link>
                                                                    </Tooltip>
                                                                )}
                                                                {checkPermissions(permissions, userType, ['awards-participants-create'], ['COMPANY']) && (
                                                                    <Tooltip title="Upload Award Winners">
                                                                        <button
                                                                            onClick={() => uploadAttendees(training, training.filename1)} className="btn btn-sm btn-outline-info ml-2 mt-2">
                                                                            <i className='fas fa-upload'></i>
                                                                        </button>
                                                                    </Tooltip>
                                                                )}

                                                                <Tooltip title="View Award Winners">
                                                                    <button onClick={() => showParticipants(training, training.filename1)} className="btn btn-sm btn-outline-info ml-2 mt-2">
                                                                        <i className='fas fa-eye'></i>
                                                                    </button>
                                                                </Tooltip>

                                                                {checkPermissions(permissions, userType, ['awards-send-certificate'], ['COMPANY']) && (
                                                                    <Tooltip title="Send Award" >
                                                                        <button
                                                                            onClick={() => sendCertificate(training)} className="btn btn-sm btn-outline-info ml-2 mt-2">
                                                                            <i class="fas fa-paper-plane"></i>
                                                                        </button>
                                                                    </Tooltip>
                                                                )}
                                                                {checkPermissions(permissions, userType, ['awards-download-certificate'], ['COMPANY']) && (
                                                                    <Tooltip title="Download Awards">
                                                                        < button
                                                                            onClick={() => downloadZip(training.id)} className="btn btn-sm btn-outline-info ml-2 mt-2" >
                                                                            <i class="fas fa-download"></i>
                                                                        </button>
                                                                    </Tooltip>
                                                                )}
                                                                {checkPermissions(permissions, userType, ['awards-delete'], ['COMPANY']) && (
                                                                    <Tooltip title="Delete">
                                                                        <button onClick={() => confirmDelete(training)} className="btn btn-sm btn-outline-danger ml-2 mt-2" to={`/award/list`}>
                                                                            <i className='fas fa-trash'></i>
                                                                        </button>
                                                                    </Tooltip>
                                                                )}

                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                        {!totalCount && <div className="select-opportunity-text">No Result Found</div>}
                        {totalCount > 0 && (
                            <TableFooter
                                count={totalCount}
                                handleChange={handleChange}
                                currentPage={queryParams.page || 1}
                                limit={queryParams.limit || 10}
                                skip={queryParams.skip || 0}
                            />
                        )}

                    </PageWrapper>
                </main>
            </div>
        </>

    )

}


export default TemplateLayoutHOC(
    CheckPermission(AwardList)(['awards-read'], ['COMPANY'])
);