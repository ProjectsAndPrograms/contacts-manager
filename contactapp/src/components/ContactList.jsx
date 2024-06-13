import React from 'react';
import Contact from './Contact';

const ContactList = ({ data, currentPage, getAllContacts }) => {
    return (
        <main className="main">
            {data?.content?.length === 0 && <div className="no_contact_container">
                    <div className='outer-box'> <div className='box'><i class="bi bi-telephone-x"></i></div> No Contacts</div>
                </div>}

            <ul className="contact__list">
                {data?.content?.length > 0 && data.content.map(contact => (
                    <Contact contact={contact} key={contact.id} />
                ))}
            </ul>

            {(data?.content?.length > 0 && data?.totalPages > 1) && (
                <div className="pagination">
                    <a
                        onClick={() => getAllContacts(currentPage - 1)}
                        className={currentPage === 0 ? 'disabled' : ''}
                    >
                        &laquo;
                    </a>

                    {data && [...Array(data.totalPages).keys()].map((page) => (
                        <a
                            onClick={() => getAllContacts(page)}
                            className={currentPage === page ? 'active' : ''}
                            key={page}
                        >
                            {page + 1}
                        </a>
                    ))}

                    <a
                        onClick={() => getAllContacts(currentPage + 1)}
                        className={data.totalPages === (currentPage + 1) ? 'disabled' : ''}
                    >
                        &raquo;
                    </a>
                </div>
               
            )
            
            
        }
           <div className='mb-5em'></div>
        </main>
    );
}

export default ContactList;
