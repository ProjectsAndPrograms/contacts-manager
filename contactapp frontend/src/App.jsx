import "react-toastify/ReactToastify.css"
import { useEffect, useState, useRef } from 'react'
import { deleteContact, getContacts, saveContact, updatePhoto } from './api/ContactService';
import { useNavigate } from 'react-router-dom';
import { Route, Routes, Navigate } from 'react-router-dom';
import { toastSuccess } from './api/ToastService';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import ContactList from './components/ContactList';
import ContactDetails from './components/ContactDetails';

function App() {

  const modalRef = useRef();
  const fileRef = useRef();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',
  });

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllContacts();
  }, [data]);

  const handleNewContact = async (event) => {
    event.preventDefault();
    try {
      const { data } = await saveContact(values);
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", data.id);
      const { data: photoUrl } = await updatePhoto(formData);
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
      });
      getAllContacts();

      toastSuccess("Contact Created Successfully!");
    } catch (error) {      
      console.error(error);
      toastError(error.message);
    }
  }

  const updateContact = async (contact) => {
    await saveContact(contact);
    getAllContacts();
  }

  const updateImage = async (formData) => {
    try {
      await updatePhoto(formData);
      getAllContacts();
    } catch (error) { 
      console.error(error); 
      toastError(error.message);
    }
  }

  const deleteContactCallback = async (id) =>{
    try {
      await deleteContact(id);
      getAllContacts();
      navigate('/');
      toastSuccess("Contact Deleted Successfully!");
  } catch (error) {
      console.error(error);
      toastError(error.message);
  }
  }


  const onChange = (event) => {
    setValues((v) => ({ ...values, [event.target.name]: event.target.value }));
  }

  const toggleModal = (show) => {
    show ? modalRef.current.showModal() : modalRef.current.close();
  }

  return (
    <>
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={'/contacts'} />} />
            <Route path="/contacts" element={<ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts} />} />
            <Route path="/contacts/:id" element={<ContactDetails updateContact={updateContact} deleteContactCallback={deleteContactCallback}  updateImage={updateImage} />} />
          </Routes>

          {/* Modal */}
          <dialog ref={modalRef} className="modal" id="modal">
            <div className="modal__header">
              <h3>New Contact</h3>
              <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
            </div>
            <div className="divider"></div>
            <div className="modal__body">
              <form onSubmit={handleNewContact}>
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Name</span>
                    <input type="text" value={values.name} onChange={onChange} name='name' required />
                  </div>
                  <div className="input-box">
                    <span className="details">Email</span>
                    <input type="text" value={values.email} onChange={onChange} name='email' required />
                  </div>
                  <div className="input-box">
                    <span className="details">Title</span>
                    <input type="text" value={values.title} onChange={onChange} name='title' required />
                  </div>
                  <div className="input-box">
                    <span className="details">Phone Number</span>
                    <input type="text" value={values.phone} onChange={onChange} name='phone' required />
                  </div>
                  <div className="input-box">
                    <span className="details">Address</span>
                    <input type="text" value={values.address} onChange={onChange} name='address' required />
                  </div>
                  <div className="input-box">
                    <span className="details">Account Status</span>
                    <input type="text" value={values.status} onChange={onChange} name='status' required />
                  </div>
                  <div className="file-input">
                    <span className="details">Profile Photo</span>
                    <input type="file" ref={fileRef} onChange={(event) => setFile(event.target.files[0])} name='photo' required />
                  </div>
                </div>
                <div className="form_footer">
                  <button onClick={() => toggleModal(false)} type='button' className="btn btn-danger">Cancel</button>
                  <button type='submit' className="btn">Save</button>
                </div>
              </form>
            </div>
          </dialog>



        </div>
      </main>
      <ToastContainer/>
    </>
  )
}

export default App
