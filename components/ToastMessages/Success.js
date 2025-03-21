import { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function ToastSuccess({ message, onClose }) {
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        onClose();
      }, 5000);
    }
  }, [message, onClose]);

  return (
    message && (
      <ToastWrapper>
        {message}
        <CloseButton onClick={onClose}>X</CloseButton>
      </ToastWrapper>
    )
  );
}

const ToastWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50; 
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 9999; 
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
`;

