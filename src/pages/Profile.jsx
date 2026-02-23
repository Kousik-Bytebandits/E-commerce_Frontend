import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Loader2,
  LogOut,
  Trash2,
  Edit,
  Save,
  X,
  Camera,
} from "lucide-react";

const Profile = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Image crop states
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const imgRef = useRef(null);

  


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/profile");
      setProfile(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch profile");
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- IMAGE UPLOAD WITH CROP ---------------- */

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setShowCropDialog(true);
      // Reset crop to default
      setCrop({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25,
        aspect: 1
      });
    };
    reader.readAsDataURL(file);

    // Clear the input so the same file can be uploaded again
    e.target.value = '';
  };

  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current) return;

    setUploadingImage(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = imgRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    // Convert canvas to blob for better performance
    canvas.toBlob(
      (blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile((prev) => ({
            ...prev,
            profile: {
              ...(prev.profile || {}),
              profileImage: reader.result,
            },
          }));
          setShowCropDialog(false);
          setSelectedImage(null);
          setUploadingImage(false);
          setError("");
        };
        reader.readAsDataURL(blob);
      },
      'image/jpeg',
      0.95 // Quality
    );
  };

  /* ---------------- UPDATE PROFILE ---------------- */

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await api.put("/user/profile", profile.profile || {});
      setSuccess("Profile updated successfully");
      setEditing(false);
      setTimeout(() => setSuccess(""), 3000);
      await fetchProfile();
    } catch (err) {
      setError("Failed to update profile");
      console.log("error", err);

    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DELETE ACCOUNT ---------------- */

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await api.delete("/user/account");
      logout();
    } catch (err) {
      setError("Failed to delete account");
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!profile) return "U";
    const profileData = profile.profile || {};
    const first = profileData.firstName?.[0] || "";
    const last = profileData.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">No profile found</p>
          <Button onClick={fetchProfile} className="mt-4">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const profileData = profile.profile || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Profile Header with Avatar */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarImage
                  src={profileData.profileImage}
                  alt={`${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              {editing && (
                <div className="absolute -bottom-2 -right-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploadingImage}
                      id="profile-image-upload"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-full bg-background shadow-md hover:bg-accent"
                      disabled={uploadingImage}
                      asChild
                    >
                      <label htmlFor="profile-image-upload" className="cursor-pointer">
                        {uploadingImage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </label>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {profileData.firstName || profileData.lastName
                      ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
                      : 'Complete your profile'}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </p>
                </div>
                {!editing && (
                  <Button
                    onClick={() => setEditing(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    disabled={!editing}
                    value={profileData.firstName || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        profile: {
                          ...profileData,
                          firstName: e.target.value,
                        },
                      })
                    }
                    className={`pl-9 ${!editing ? 'bg-muted/50 border-muted' : ''}`}
                    placeholder="First name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    disabled={!editing}
                    value={profileData.lastName || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        profile: {
                          ...profileData,
                          lastName: e.target.value,
                        },
                      })
                    }
                    className={`pl-9 ${!editing ? 'bg-muted/50 border-muted' : ''}`}
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="pl-9 bg-muted/50 border-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your email address cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  disabled={!editing}
                  value={profileData.phone || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      profile: {
                        ...profileData,
                        phone: e.target.value,
                      },
                    })
                  }
                  className={`pl-9 ${!editing ? 'bg-muted/50 border-muted' : ''}`}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-sm font-medium">
                Date of birth
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dob"
                  type="date"
                  disabled={!editing}
                  value={
                    profileData.dateOfBirth
                      ? profileData.dateOfBirth.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      profile: {
                        ...profileData,
                        dateOfBirth: e.target.value,
                      },
                    })
                  }
                  className={`pl-9 ${!editing ? 'bg-muted/50 border-muted' : ''}`}
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium">
                Gender
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                {editing ? (
                  <Select
                    value={profileData.gender || ""}
                    onValueChange={(value) =>
                      setProfile({
                        ...profile,
                        profile: {
                          ...profileData,
                          gender: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="gender"
                    disabled
                    value={profileData.gender || "Not specified"}
                    className="pl-9 bg-muted/50 border-muted"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Edit Mode Buttons */}
          {editing && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleUpdate}
                disabled={loading || uploadingImage}
                className="flex-1 gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
                disabled={loading}
                className="flex-1 gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}

          <Separator className="my-6" />

          {/* Account Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account settings</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={logout}
                disabled={loading}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete account
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
        </div>
      </div>

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {selectedImage && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
                className="max-h-[60vh] max-w-full"
              >
                <img
                  ref={imgRef}
                  src={selectedImage}
                  alt="Crop preview"
                  style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain' }}
                  onLoad={() => {
                    setCompletedCrop(null);
                  }}
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowCropDialog(false);
                setSelectedImage(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={getCroppedImg}
              disabled={!completedCrop}
            >
              Apply Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;