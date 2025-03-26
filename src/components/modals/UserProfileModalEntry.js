import React, { useState } from 'react';
import UserProfileModal from './UserProfileModal';

const UserProfileModalEntry = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleSuccess = () => {
    // 可以在这里处理成功保存后的回调
  };

  return {
    showUserProfileModal: showModal,
    UserProfileModalComponent: (
      <UserProfileModal 
        open={modalVisible} 
        onClose={hideModal}
        onSuccess={handleSuccess}
      />
    )
  };
};

export default UserProfileModalEntry; 