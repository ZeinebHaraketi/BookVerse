import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const RoleSelectionModal = () => {
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    localStorage.setItem('userRole', role);
  };
 

  return (
    <Modal isOpen={true}>
      <ModalHeader>Select Your Role</ModalHeader>
      <ModalBody>
        {/* Render your role selection options here */}
        <Button 
            color="primary"
            className="mb-2"
            href = "/register?role=membre"
            onClick={() => handleRoleSelection('membre')}
        >
          Membre
        </Button>
        <Button 
            color="success" 
            className="mb-2"
            href = "/register?role=moderateur"
            onClick={() => handleRoleSelection('moderateur')}
        >
          Modérateur
        </Button>
        <Button 
            color="danger" 
            className="mb-2"
            href = "/register?role=admin"
            onClick={() => handleRoleSelection('admin')}
        >
          Admin
        </Button>
      </ModalBody>
      
    </Modal>
  );
};


export default RoleSelectionModal;