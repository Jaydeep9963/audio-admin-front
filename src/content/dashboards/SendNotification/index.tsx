import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container
} from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router';
import { toast } from 'react-toast';
import NotificationApiService from 'src/services/notification-api.service';

const SendNotification: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [tokensLoading, setTokensLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Helper function to strip HTML tags and decode HTML entities
  const stripHtmlTags = (html: string): string => {
    // Create a temporary DOM element to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Get text content and clean up whitespace
    const text = temp.textContent || temp.innerText || '';
    return text.replace(/\s+/g, ' ').trim();
  };
  
  // Helper function to generate timestamp
  const generateTimestamp = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  // Fetch token count
  const fetchTokens = async () => {
    try {
      setTokensLoading(true);
      const response = await NotificationApiService.getAllNotificationTokens();
      console.log('🚀 ~ fetchTokens ~ response:', response);
      
      if (response && response.results) {
        setTokenCount(response.results.length);
      } else if (response && response.total !== undefined) {
        setTokenCount(response.total);
      } else {
        setTokenCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch notification tokens:', error);
      setTokenCount(0);
      toast.error('Failed to fetch notification tokens');
    } finally {
      setTokensLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    
    const interval = setInterval(() => {
      fetchTokens();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    // Strip HTML tags from content before validation
    const plainTextContent = stripHtmlTags(content);
    
    if (!plainTextContent.trim()) {
      toast.error('Please fill in the content');
      return;
    }

    await fetchTokens();

    try {
      setLoading(true);

      if (tokenCount === 0) {
        console.warn('No notification tokens available, but proceeding with API call');
        toast.warn('No notification tokens found, but attempting to send...');
      }
      
      // Send plain text content instead of HTML
      const response = await NotificationApiService.sendNotificationToAll({
        data: {
          title: 'Music Player', 
          msg: plainTextContent, // Send plain text without HTML tags
          notification_at: generateTimestamp(),
        }
      });

      console.log('🚀 ~ handleSend ~ response:', response);
      console.log('📝 ~ Plain text sent:', plainTextContent); // Debug log
      
      if (response.data) {
        toast.success(
          `${response.message || 'Notification sent successfully!'} 
           Sent: ${response.data.totalSent}, 
           Success: ${response.data.totalSuccess}, 
           Failed: ${response.data.totalFailure}`
        );
      } else {
        toast.success(response.message || 'Notification sent successfully!');
      }
      
      setContent('');
      
      setTimeout(() => {
        fetchTokens();
      }, 1000);
      
    } catch (error: any) {
      console.error('🚀 ~ handleSend ~ error:', error);
      toast.error(error.message || 'Failed to send notification');
      
      setTimeout(() => {
        fetchTokens();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => {
    setContent('');
  };

  const handleRefreshTokens = () => {
    fetchTokens();
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Send Notification
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefreshTokens}
            disabled={tokensLoading}
          >
            {tokensLoading ? 'Loading...' : 'Refresh Tokens'}
          </Button>
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {tokensLoading 
            ? 'Loading token count...' 
            : tokenCount > 0 
              ? `Notification will be sent to ${tokenCount} devices` 
              : 'No notification tokens available to send notifications'
          }
        </Typography>
        
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notification Content
          </Typography>
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(_, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
            config={{
              placeholder: 'Enter notification content... (HTML formatting will be removed when sending)'
            }}
          />
        </Box>

        {/* Preview of plain text that will be sent */}
        {content && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Preview (plain text that will be sent):
            </Typography>
            <Typography variant="body2">
              {stripHtmlTags(content) || 'Empty message'}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSend}
            disabled={!stripHtmlTags(content).trim() || loading || tokensLoading}
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </Button>
          <Button variant="outlined" color="error" onClick={onClear}>
            Clear
          </Button>
        </Box>
        
        {tokenCount === 0 && !tokensLoading && (
          <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
            ⚠️ Warning: No notification tokens found. The notification may not be delivered to any devices.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default SendNotification;