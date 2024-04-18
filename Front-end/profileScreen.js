import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, Image, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import tw from '../tailwind.config.js';
import theme from './theme.js';
import {
  fetchWithAuth,
  getUserIdFromToken,
  saveProfile,
  API_URL,
} from './utils.js';
import {Text, TouchableOpacity} from 'react-native';
import TagCloud from './tagCloud.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [discord, setDiscord] = useState('');
  const [email, setEmail] = useState('');
  const [steam, setSteam] = useState('');
  const navigation = useNavigation();
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const tagPool = [
    {tag_id: 1, tag_name: 'Gaming'},
    {tag_id: 2, tag_name: 'Music'},
    {tag_id: 3, tag_name: 'Sports'},
    {tag_id: 4, tag_name: 'Movies'},
    {tag_id: 5, tag_name: 'Technology'},
    {tag_id: 6, tag_name: 'Books'},
    {tag_id: 7, tag_name: 'Art'},
    {tag_id: 8, tag_name: 'Food'},
    {tag_id: 9, tag_name: 'Travel'},
    {tag_id: 10, tag_name: 'Fashion'},

  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = 1
        setUserId(userId);
        const profileData = await fetchWithAuth(`/profiles/${userId}`, 'GET');
        setUsername(profileData.username);
        setImageUri(profileData.image_url);
        setDiscord(profileData.discord);
        setEmail(profileData.email);
        setSteam(profileData.steam);
        setSelectedTags(profileData.tags);
      }
      catch (error) {
        console.error('Failed to fetch profile:', error);
        Alert.alert('Error', error.message || 'Failed to fetch profile.');
      }
    };

    fetchProfile();
  }, []);

  // const handleSaveProfile = async () => {
  //   setIsSaving(true);
  //   try {
  //     const profileData = {
  //       username,
  //       image_url: imageUri,
  //       discord,
  //       email,
  //       steam,
  //       tags: selectedTags,
  //     };
  //     await saveProfile(userId, profileData);
  //     Alert.alert('Success', 'Profile updated successfully');
  //     navigation.navigate('Home');
  //   } catch (error) {
  //     console.error('Failed to save profile:', error);
  //     Alert.alert('Error', error.message || 'Failed to update profile.');
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
const handleSaveProfile = async () => {
  setIsSaving(true);
  try {
    const profileData = {
      username,
      image_url: imageUri,
      discord,
      email,
      steam,
      tags: selectedTags,
    };
    // Simulate saving the profile
    console.log('Saving profile:', profileData);
    Alert.alert('Success', 'Profile updated successfully');
    navigation.navigate('Home');
  } catch (error) {
    console.error('Failed to save profile:', error);
    Alert.alert('Error', error.message || 'Failed to update profile.');
  } finally {
    setIsSaving(false);
  }
};
  const handleToggleTag = tagId => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <View
      style={[
        tw`flex-1 justify-center items-center p-4`,
        {backgroundColor: theme.colors.background},
      ]}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        style={tw`border border-gray-400 p-2 w-80 mb-4`}
      />
      <TextInput
        value={discord}
        onChangeText={setDiscord}
        placeholder="Discord"
        style={tw`border border-gray-400 p-2 w-80 mb-4`}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={tw`border border-gray-400 p-2 w-80 mb-4`}
      />
      <TextInput
        value={steam}
        onChangeText={setSteam}
        placeholder="Steam"
        style={tw`border border-gray-400 p-2 w-80 mb-4`}
      />
      <TextInput
        value={imageUri}
        onChangeText={setImageUri}
        placeholder="Image URL"
        style={tw`border border-gray-400 p-2 w-80 mb-4`}
      />
      {imageUri && (
        <Image source={{uri: imageUri}} style={tw`h-40 w-full my-4`} />
      )}
      <View style={tw`mt-4`}>
        <Text style={tw`text-lg font-bold mb-2`}>Tags</Text>
        <TagCloud
          tags={tagPool.map(tag => ({
            ...tag,
            is_included: selectedTags.includes(tag.tag_id),
          }))}
          onToggleTag={handleToggleTag}
        />
      </View>
      <Button
        title="Save Profile"
        onPress={handleSaveProfile}
        disabled={isSaving}
      />
    </View>
  );
};

export default ProfileScreen;