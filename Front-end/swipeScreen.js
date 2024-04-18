import React, {useState, useEffect} from 'react';
import {View, Text, Button, Alert, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getPodForSwipe, dismissPod} from './utils.js';
import tw from 'twrnc';

const SwipeScreen = () => {
  const [currentPod, setCurrentPod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAndSetNextPod();
  }, []);

  const fetchAndSetNextPod = async () => {
    setIsLoading(true);
    try {
      const pod = await getPodForSwipe();
      if (!pod || !pod.pod_id) {
        Alert.alert('Notice', 'No more pods available for swiping.');
        setCurrentPod(null);
      } else {
        setCurrentPod(pod);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'An error occurred while fetching the next pod.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissPod = async () => {
    if (currentPod && currentPod.pod_id) {
      try {
        await dismissPod(currentPod.pod_id);
        Alert.alert(
          'Pod dismissed',
          `You have dismissed ${currentPod.pod_name}`,
        );
        fetchAndSetNextPod();
      } catch (error) {
        Alert.alert(
          'Error',
          error.message || 'An error occurred while dismissing the pod.',
        );
      }
    }
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg`}>Loading...</Text>
      </View>
    );
  }

  if (!currentPod) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-lg`}>No more pods to swipe.</Text>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 justify-center items-center p-4`}>
      <Image
        source={{uri: currentPod.image_url}}
        style={tw`w-64 h-64 rounded-lg mb-4`}
        resizeMode="cover"
      />
      <Text style={tw`text-2xl font-bold mb-4`}>{currentPod.pod_name}</Text>
      <View style={tw`flex-row justify-around w-full`}>
        <Button title="Swipe Left" onPress={handleDismissPod} color="#FF5A5F" />
        <Button
          title="Swipe Right"
          onPress={() =>
            navigation.navigate('PodDisplay', {podId: currentPod.pod_id})
          }
          color="#00C853"
        />
      </View>
      <Button
        title="Home"
        onPress={() => navigation.navigate('Home')}
        style={tw`mt-4`}
      />
    </View>
  );
};

export default SwipeScreen;