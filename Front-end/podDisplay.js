import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {joinPod, leavePod, fetchWithAuth, API_URL} from './utils.js';
import tw from 'twrnc';
import theme from './theme.js';

const PodDisplay = ({route}) => {
  const {podId} = route.params;
  const [pod, setPod] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([
  ]);
  const [isOwner, setIsOwner] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPodDetails = async () => {
      try {
        const podDetails = await fetchWithAuth(
          `${API_URL}/pods/${podId}`,
          'GET',
        );
        setPod(podDetails);
        setIsOwner(podDetails.is_owner); // Assuming the API response includes an 'is_owner' field
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to fetch pod details');
      }
    };

    fetchPodDetails();
  }, [podId]);

  const handleJoinPod = async () => {
    try {
      await joinPod(podId);
      // Update the pod details after joining
      const updatedPodDetails = await fetchWithAuth(
        `${API_URL}/pods/${podId}`,
        'GET',
      );
      setPod(updatedPodDetails);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to join pod');
    }
  };

  const handleLeavePod = async () => {
    try {
      await leavePod(podId);
      // Update the pod details after leaving
      const updatedPodDetails = await fetchWithAuth(
        `${API_URL}/pods/${podId}`,
        'GET',
      );
      setPod(updatedPodDetails);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to leave pod');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, {name: newTag.trim(), is_included: true}]);
      setNewTag('');
    }
  };

  const handleToggleTag = tagId => {
    if (isOwner) {
      const updatedTags = tags.map(tag =>
        tag.tag_id === tagId ? {...tag, is_included: !tag.is_included} : tag,
      );
      setTags(updatedTags);
    }
  };

  if (!pod) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading pod details...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-4`}>
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`text-2xl font-bold`}>{pod.pod_name}</Text>
        {isOwner ? (
          <Button
            title="Leave Pod"
            onPress={handleLeavePod}
            color={theme.colors.danger}
          />
        ) : (
          <Button
            title="Join Pod"
            onPress={handleJoinPod}
            color={theme.colors.primary}
          />
        )}
      </View>
      <View style={tw`mt-4`}>
        {pod.image_url && (
          <Image
            source={{uri: pod.image_url}}
            style={[theme.components.image, tw`rounded-lg`]}
          />
        )}
        <View style={tw`mt-4`}>
          <Text style={tw`text-lg font-bold`}>Details</Text>
          <View style={tw`mt-2`}>
            {pod.discord && (
              <View style={tw`flex-row items-center`}>
                <Text style={tw`font-bold`}>Discord:</Text>
                <Text style={tw`ml-2`}>{pod.discord}</Text>
              </View>
            )}
            {pod.email && (
              <View style={tw`flex-row items-center mt-2`}>
                <Text style={tw`font-bold`}>Email:</Text>
                <Text style={tw`ml-2`}>{pod.email}</Text>
              </View>
            )}
            {pod.steam && (
              <View style={tw`flex-row items-center mt-2`}>
                <Text style={tw`font-bold`}>Steam:</Text>
                <Text style={tw`ml-2`}>{pod.steam}</Text>
              </View>
            )}
            <View style={tw`flex-row items-center mt-2`}>
              <Text style={tw`font-bold`}>Max Capacity:</Text>
              <Text style={tw`ml-2`}>{pod.max_capacity}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={tw`mt-4`}>
        <TextInput
          style={tw`border border-gray-300 p-2 rounded mb-2`}
          placeholder="Add a new tag..."
          value={newTag}
          onChangeText={setNewTag}
          editable={isOwner}
        />
        {isOwner && (
          <Button
            title="Add Tag"
            onPress={handleAddTag}
            color={theme.colors.primary}
          />
        )}
        <TagCloud tags={tags} onToggleTag={handleToggleTag} />{' '}

      </View>
    </View>
  );
};

export default PodDisplay;