import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axios from 'axios';

const DictionaryModal = ({ word, apiKey }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [wordDefinition, setWordDefinition] = useState('');

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  

  const fetchWordDefinition = async () => {
    try {
      const response = await axios.get(
        `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
      );
      const definition = response.data[0].shortdef[0];
      setWordDefinition(definition);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching word definition:', error);
    }
  };

  return (
    <>
      <button onClick={fetchWordDefinition} className="dictionary-button">
        {word}
      </button>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Word Definition</ModalHeader>
        <ModalBody>{wordDefinition}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DictionaryModal;
