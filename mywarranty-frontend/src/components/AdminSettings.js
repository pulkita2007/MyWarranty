import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaCloudUploadAlt, FaTrashAlt, FaDownload, FaUpload } from 'react-icons/fa';
import { MdOutlineDateRange, MdCurrencyRupee, MdLanguage, MdOutlineColorLens } from 'react-icons/md';
import { BiSolidCrown } from 'react-icons/bi';
import authService from '../services/authService';

const AdminSettings = () => {
    const [profileSettings, setProfileSettings] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });

    const [notificationPreferences, setNotificationPreferences] = useState({
        emailWarranty: true,
        smsWarranty: false,
        pushWarranty: false,
        remindBeforeDays: 30,
        emailBill: true,
        smsBill: false,
        pushBill: false,
        productUpdates: true,
        tipsAndRecommendations: true,
    });

    const [appPreferences, setAppPreferences] = useState({
        dateFormat: 'YYYY-MM-DD',
        currency: 'Indian Rupee',
        language: 'English',
        theme: 'Light',
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = await authService.getUserProfile();
                setProfileSettings({
                    firstName: userProfile.firstName || '',
                    lastName: userProfile.lastName || '',
                    email: userProfile.email || '',
                    phoneNumber: userProfile.phoneNumber || '',
                });
                setNotificationPreferences({
                    emailWarranty: userProfile.preferences?.emailWarranty || true,
                    smsWarranty: userProfile.preferences?.smsWarranty || false,
                    pushWarranty: userProfile.preferences?.pushWarranty || false,
                    remindBeforeDays: userProfile.preferences?.remindBeforeDays || 30,
                    emailBill: userProfile.preferences?.emailBill || true,
                    smsBill: userProfile.preferences?.smsBill || false,
                    pushBill: userProfile.preferences?.pushBill || false,
                    productUpdates: userProfile.preferences?.productUpdates || true,
                    tipsAndRecommendations: userProfile.preferences?.tipsAndRecommendations || true,
                });
                setAppPreferences({
                    dateFormat: userProfile.preferences?.dateFormat || 'YYYY-MM-DD',
                    currency: userProfile.preferences?.currency || 'Indian Rupee',
                    language: userProfile.preferences?.language || 'English',
                    theme: userProfile.preferences?.theme || 'Light',
                });
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfileSettings({ ...profileSettings, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (e) => {
        const { name, type, checked, value } = e.target;
        setNotificationPreferences({
            ...notificationPreferences,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAppPreferenceChange = (e) => {
        setAppPreferences({ ...appPreferences, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.updateUserProfile(profileSettings);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response.data.msg || 'Failed to update profile');
        }
    };

    const handleSavePreferences = async (e) => {
        e.preventDefault();
        try {
            const updatedPreferences = {
                ...profileSettings,
                preferences: {
                    ...notificationPreferences,
                    ...appPreferences,
                },
            };
            await authService.updateUserProfile(updatedPreferences);
            alert('Preferences saved successfully!');
        } catch (error) {
            console.error('Error saving preferences:', error);
            alert(error.response.data.msg || 'Failed to save preferences');
        }
    };

    const handleExportData = async () => {
        try {
            const data = await authService.exportUserData();
            console.log('Exported Data:', data);
            alert('Data exported successfully! Check console for details.');
        } catch (error) {
            console.error('Error exporting data:', error);
            alert(error.response.data.msg || 'Failed to export data');
        }
    };

    const [passwordChange, setPasswordChange] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handlePasswordChange = (e) => {
        setPasswordChange({ ...passwordChange, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordChange.newPassword !== passwordChange.confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            await authService.changePassword(passwordChange.currentPassword, passwordChange.newPassword);
            alert("Password changed successfully!");
            setPasswordChange({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            console.error("Error changing password:", error);
            alert(error.response.data.msg || "Failed to change password.");
        }
    };

    return (
        <Container fluid className="p-3">
            <h1 className="mb-4">Admin Settings</h1>

            {/* Profile Settings */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <h4 className="mb-3">Profile Settings</h4>
                    <Form onSubmit={handleProfileSubmit}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="profileFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={profileSettings.firstName}
                                        onChange={handleProfileChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="profileLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={profileSettings.lastName}
                                        onChange={handleProfileChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="profileEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={profileSettings.email}
                                        onChange={handleProfileChange}
                                    />
                                    {/* <Form.Text className="text-muted">Email cannot be changed</Form.Text> */}
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group controlId="profilePhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={profileSettings.phoneNumber}
                                        onChange={handleProfileChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="profilePicture" className="mb-3">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => console.log("Profile picture selected:", e.target.files[0])}
                            />
                            <Form.Text className="text-muted">
                                Upload a new profile picture.
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Update Profile
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Change Password */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <h4 className="mb-3">Change Password</h4>
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group controlId="currentPassword" className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="currentPassword"
                                value={passwordChange.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="newPassword" className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={passwordChange.newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="confirmNewPassword" className="mb-3">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmNewPassword"
                                value={passwordChange.confirmNewPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Update Password
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Notification Preferences */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <h4 className="mb-3">Notification Preferences</h4>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Warranty Reminders</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id="emailWarranty"
                                    label="Email notifications for warranty expiry"
                                    name="emailWarranty"
                                    checked={notificationPreferences.emailWarranty}
                                    onChange={handleNotificationChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="smsWarranty"
                                    label="SMS notifications"
                                    name="smsWarranty"
                                    checked={notificationPreferences.smsWarranty}
                                    onChange={handleNotificationChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="pushWarranty"
                                    label="Push notifications"
                                    name="pushWarranty"
                                    checked={notificationPreferences.pushWarranty}
                                    onChange={handleNotificationChange}
                                />
                                <Form.Group controlId="remindBeforeDays" className="mt-3">
                                    <Form.Label>Remind me before (days)</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="remindBeforeDays"
                                        value={notificationPreferences.remindBeforeDays}
                                        onChange={handleNotificationChange}
                                        style={{ width: '120px' }}
                                    >
                                        <option value="7">7 Days</option>
                                        <option value="15">15 Days</option>
                                        <option value="30">30 Days</option>
                                        <option value="60">60 Days</option>
                                        <option value="90">90 Days</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Bill Reminders</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id="emailBill"
                                    label="Email notifications for bill management"
                                    name="emailBill"
                                    checked={notificationPreferences.emailBill}
                                    onChange={handleNotificationChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="smsBill"
                                    label="SMS notifications"
                                    name="smsBill"
                                    checked={notificationPreferences.smsBill}
                                    onChange={handleNotificationChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="pushBill"
                                    label="Push notifications"
                                    name="pushBill"
                                    checked={notificationPreferences.pushBill}
                                    onChange={handleNotificationChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">General Notifications</Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id="productUpdates"
                                    label="Product updates and news"
                                    name="productUpdates"
                                    checked={notificationPreferences.productUpdates}
                                    onChange={handleNotificationChange}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="tipsAndRecommendations"
                                    label="Tips and recommendations"
                                    name="tipsAndRecommendations"
                                    checked={notificationPreferences.tipsAndRecommendations}
                                    onChange={handleNotificationChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit" onClick={handleSavePreferences} className="mt-3">
                        Save Preferences
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminSettings;
