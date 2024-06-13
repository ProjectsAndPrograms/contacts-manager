import React, { useEffect, useRef, useState } from 'react'
import {  useParams } from 'react-router-dom';
import { getContact } from '../api/ContactService';
import { Link } from 'react-router-dom';
import { toastError, toastSuccess } from '../api/ToastService';

const ContactDetails = ({ updateContact, deleteContactCallback, updateImage }) => {
    const inputRef = useRef();
  
    const [contact, setContact] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
        photoUrl: ''
    });

    const { id } = useParams();

    const fetchContact = async (id) => {
        try {
            const { data } = await getContact(id);
            setContact(data);
        } catch (error) {
            console.error(error);
            toastError(error.message);
        }
    };

    const selectImage = () => {
        inputRef.current.click();
    };

    const updatePhoto = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            await updateImage(formData);

            setContact((prev) => ({ ...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}` }));
            toastSuccess("Photo Updated Successfully");
        } catch (error) {
            console.error(error);
            toastError(error.message);
        }
    }

    useEffect(() => {
        fetchContact(id);
    }, []);

    const onChange = (event) => {
        setContact((c) => ({ ...c, [event.target.name]: event.target.value }));
    };

    const onUpdateContact = async (event) => {
        event.preventDefault();
        await updateContact(contact);
        toastSuccess("Contact Updated Successfully");
        fetchContact(id);
    }

    const deleteContactHandler = async (id) =>{
           try{
            await deleteContactCallback(id);
           }catch(error){
            console.error(error);
           }
        
    }

    return (
        <>
            <Link to={'/'} className="link"> <i className="bi bi-arrow-left"></i> Back to list</Link>
            <div className="profile">
                <div>
                    <div className="profile__details">
                        <img src={contact.photoUrl} alt={`Profile photo of ${contact.name}`} />

                        <div className="profile__metadata">
                            <p className="profile__name">{contact.name}</p>
                            <p className="profile__muted">JPG, GIF, or PNG max size of 10MB</p>
                            <button onClick={selectImage} className="btn"><i className="bi bi-cloud-upload"></i> Change Photo</button>
                        </div><br />

                    </div>

                    <div className='profile__details delete'>
                        <h4> <i className="bi bi-exclamation-triangle text-danger"></i> Danger Zone</h4>
                        <p className="profile__muted">When you delete a contact it will deleted parmanently!</p>
                        <button className='btn' onClick={()=>{deleteContactHandler(contact.id);}}>DELETE CONTACT</button>
                    </div>
                </div>

                <div className='profile__settings'>
                    <div>
                        <form onSubmit={onUpdateContact} className="form">
                            <div className="user-details">
                                <input type="hidden" defaultValue={contact.id} name="id" required />
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" value={contact.name} onChange={onChange} name="name" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Email</span>
                                    <input type="text" value={contact.email} onChange={onChange} name="email" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Phone</span>
                                    <input type="text" value={contact.phone} onChange={onChange} name="phone" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Address</span>
                                    <input type="text" value={contact.address} onChange={onChange} name="address" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Title</span>
                                    <input type="text" value={contact.title} onChange={onChange} name="title" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Status</span>
                                    <input type="text" value={contact.status} onChange={onChange} name="status" required />
                                </div>
                            </div>
                            <div className="form_footer">
                                <button type="submit" className="btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <form style={{ display: 'none' }}>
                <input type='file' ref={inputRef} onChange={(event) => updatePhoto(event.target.files[0])} name='file' accept='image/*' />
            </form>

        </>

    )
}

export default ContactDetails;