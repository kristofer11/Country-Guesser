import { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import CloudflareCaptcha from './CloudflareCaptcha';
import { CAPTCHA_CONFIG } from '../config/captcha';

const API_URL = 'http://localhost:4000/api/comments';

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [author, setAuthor] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    // Handle Cloudflare CAPTCHA verification
    const handleCaptchaVerify = (token) => {
        setCaptchaToken(token);
        setCaptchaVerified(true);
    };

    const handleCaptchaError = (error) => {
        setMessage(error);
        setMessageType('danger');
        setCaptchaVerified(false);
    };

    useEffect(() => {
        loadComments();
    }, []);

    // Fetch comments from API
    const loadComments = async () => {
        try {
            setLoading(true);
            const res = await fetch(API_URL);
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Post comment to API
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!author.trim() || !newComment.trim()) {
            setMessage('Please fill in all fields');
            setMessageType('warning');
            return;
        }
        if (!captchaVerified) {
            setMessage('Please complete the security verification.');
            setMessageType('warning');
            return;
        }
        try {
            setLoading(true);
            const now = Date.now();
            const dateString = new Date().toLocaleString();
            const commentData = {
                author: author.trim(),
                content: newComment.trim(),
                timestamp: now,
                dateString: dateString,
            };
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData),
            });
            if (!res.ok) throw new Error('Failed to post comment');
            // Reset form and reload comments
            setNewComment('');
            setAuthor('');
            setCaptchaToken('');
            setCaptchaVerified(false);
            await loadComments();
            setMessage('Comment posted successfully!');
            setMessageType('success');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to post comment:', error);
            setMessage('Failed to post comment. Please try again.');
            setMessageType('danger');
        } finally {
            setLoading(false);
        }
    };

    // Use dateString if present, otherwise fallback to timestamp
    const formatDate = (timestamp, dateString) => {
        if (dateString) return dateString;
        const date = new Date(Number(timestamp));
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{ 
            marginTop: '2rem',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '2rem auto'
        }}>
            <h3 style={{ 
                textAlign: 'center', 
                marginBottom: '2rem',
                color: '#333',
                fontSize: '1.5rem',
                fontWeight: 'bold'
            }}>
                💬 Comments
            </h3>

            {message && (
                <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
                    {message}
                </Alert>
            )}

            {/* Comment Form */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                border: '1px solid #e9ecef',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Form onSubmit={handleSubmit} style={{
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'left',
                }}>
                    <h5 style={{ 
                        marginBottom: '1.5rem', 
                        color: '#495057',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        borderBottom: '2px solid #f8f9fa',
                        paddingBottom: '0.75rem',
                        textAlign: 'center'
                    }}>
                        💬 Leave a Comment
                    </h5>
                    <Form.Group className="mb-4">
                        <Form.Label style={{ 
                            color: '#374151', 
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                        }}>
                            Name
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Enter your name"
                            maxLength="30"
                            required
                            style={{ 
                                color: '#212529',
                                border: '1px solid #d1d5db',
                                borderRadius: '12px',
                                padding: '0.875rem 1rem',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s ease',
                                outline: 'none',
                                width: '100%',
                                marginBottom: '0.5rem',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#d1d5db';
                                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label style={{ 
                            color: '#374151', 
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                        }}>
                            Comment
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts about the game..."
                            maxLength="500"
                            required
                            style={{ 
                                color: '#212529',
                                border: '1px solid #d1d5db',
                                borderRadius: '12px',
                                padding: '1rem',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                resize: 'vertical',
                                minHeight: '120px',
                                transition: 'all 0.2s ease',
                                outline: 'none',
                                lineHeight: '1.6',
                                width: '100%',
                                marginBottom: '0.25rem',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#d1d5db';
                                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                            }}
                        />
                        <div style={{ 
                            textAlign: 'right', 
                            marginTop: '0.25rem',
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            fontWeight: '500',
                            width: '100%'
                        }}>
                            {newComment.length}/500 characters
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label style={{ 
                            color: '#374151', 
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'block',
                        }}>
                            Security Verification
                        </Form.Label>
                        <CloudflareCaptcha
                            siteKey={CAPTCHA_CONFIG.siteKey}
                            onVerify={handleCaptchaVerify}
                            onError={handleCaptchaError}
                        />
                        {captchaVerified && (
                            <div style={{
                                color: '#28a745',
                                fontSize: '0.875rem',
                                marginTop: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>✅</span>
                                <span>Verification completed</span>
                            </div>
                        )}
                    </Form.Group>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: '100%',
                            padding: '0.875rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                            boxShadow: '0 2px 4px rgba(0,123,255,0.3)',
                            transition: 'all 0.2s ease',
                            marginTop: '0.5rem'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Posting...
                            </>
                        ) : (
                            'Post Comment'
                        )}
                    </Button>
                </Form>
            </div>

            {/* Comments List */}
            <div>
                <h5 style={{ marginBottom: '1rem', color: '#495057' }}>
                    Recent Comments ({comments.length})
                </h5>
                
                {loading && comments.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {comments.length === 0 && !loading && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px dashed #dee2e6'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💭</div>
                        <p style={{ color: '#6c757d', margin: 0 }}>
                            No comments yet. Be the first to share your thoughts!
                        </p>
                    </div>
                )}

                {comments.length > 0 && (
                    <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {comments.map((comment, index) => (
                            <div key={comment.id} style={{
                                backgroundColor: 'white',
                                padding: '1.25rem',
                                borderRadius: '10px',
                                marginBottom: '1rem',
                                border: '1px solid #e9ecef',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                textAlign: 'left',
                                width: '90%',
                                maxWidth: '700px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '1rem',
                                fontWeight: '500',
                                color: '#374151',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                            }}>
                                <span style={{ fontWeight: '600', marginRight: '0.5rem' }}>{comment.author}</span>
                                <span style={{ color: '#6b7280', marginRight: '0.5rem' }}>- {comment.content}</span>
                                <span style={{ color: '#6c757d', fontSize: '0.95em', marginLeft: 'auto', whiteSpace: 'nowrap' }}>- {formatDate(comment.timestamp, comment.dateString)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection; 