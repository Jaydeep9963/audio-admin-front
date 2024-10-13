import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({ children, open, handleClose }) {
  return (
    <Dialog  open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent sx={{
        padding: 0,
        margin:0,
        width: "auto"
      }}>{children}</DialogContent>
    </Dialog>
  );
}
