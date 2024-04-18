import React, {useState, useEffect} from 'react';
import {ScrollView, Alert, View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';
import {fetchWithAuth, createPod, dismissPod} from './utils';
import {CustomInput, CustomButton, PodItem, ExpandButton} from './utils';
import theme from './theme';
import TagCloud from './tagCloud';

const PodsOverview = () => {
  const [pods, setPods] = useState([
    {
      pod_id: 1,
      pod_name: 'Pod 1',
      image_url: 'https://pngimg.com/uploads/superman/superman_PNG5.png',
      discord: 'discord.gg/pod1',
      email: 'gaming-pod@test.com',
      steam: 'steamcommunity.com/pod1',
      max_capacity: 5,
      tags: [
        {tag_id: 1, tag_name: 'Gaming', is_included: true},
        {tag_id: 2, tag_name: 'Cards', is_included: true},
        {tag_id: 3, tag_name: 'competative games', is_included: true},
        {tag_id: 4, tag_name: 'FPS', is_included: true},
      ],
    },
    {
      pod_id: 2,
      pod_name: 'Art Pod',
      image_url: 'https://pngimg.com/uploads/superman/superman_PNG5.png',
      discord: 'art-pod#5678',
      email: 'art-pod@example.com',
      max_capacity: 8,
    },
    {
      pod_id: 3,
      pod_name: 'Music Pod',
      image_url: 'https://pngimg.com/uploads/superman/superman_PNG5.png',
      discord: 'music-pod#9012',
      email: 'music-pod@example.com',
      steam: 'music-pod',
      max_capacity: 12,
    },
  ]);
  const [dismissedPods, setDismissedPods] = useState([]);
  const [newPod, setNewPod] = useState({
    pod_name: '',
    image_url: '',
    discord: '',
    email: '',
    steam: '',
    max_capacity: '',
    tags: [
      {name: 'gaming', is_included: true},
      {name: 'Cards', is_included: true},
      {name: 'competative games', is_included: true},
      {name: 'FPS', is_included: true},
    ],
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const podsData = await fetchWithAuth('/pods', 'GET');
      setPods(podsData);
      const dismissedData = await fetchWithAuth('/dismissed_pods', 'GET');
      setDismissedPods(dismissedData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  const handleCreatePod = async () => {
    try {
      const createdPod = await createPod(newPod);
      Alert.alert('Success', 'Pod created successfully');
      setPods([...pods, createdPod]);
      resetNewPodForm();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create pod');
    }
  };

  const handleDismissPod = async podId => {
    try {
      await dismissPod(podId);
      Alert.alert('Pod Dismissed', 'The pod has been dismissed.');
      fetchData();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to dismiss pod');
    }
  };

  const handleToggleTag = index => {
    const updatedTags = [...newPod.tags];
    updatedTags[index].is_included = !updatedTags[index].is_included;
    setNewPod({...newPod, tags: updatedTags});
  };

  const resetNewPodForm = () => {
    setNewPod({
      pod_name: '',
      image_url: '',
      discord: '',
      email: '',
      steam: '',
      max_capacity: '',
      tags: [
        {name: 'gaming', is_included: true},
        {name: 'Cards', is_included: true},
        {name: 'competative games', is_included: true},
        {name: 'FPS', is_included: true},
      ],
    });
  };

  const renderPods = () => {
    const visiblePods = isExpanded ? pods : pods.slice(0, 3);

    return (
      <>
        {visiblePods.map((pod) => (
          <PodItem
            key={pod.pod_id}
            pod={pod}
            onPress={() => navigation.navigate('PodDisplay', { podId: pod.pod_id })}
            onDismiss={() => handleDismissPod(pod.pod_id)}
          />
        ))}
        {pods.length > 3 && (
          <ExpandButton
            isExpanded={isExpanded}
            onPress={() => setIsExpanded(!isExpanded)}
          />
        )}
      </>
    );
  };

  const renderDismissedPods = () => {
    return (
      <>
        {dismissedPods.map((pod) => (
          <View
            key={pod.pod_id}
            style={tw`mb-4 p-4 bg-gray-600 rounded-lg flex-row items-center`}
          >
            <Text style={tw`text-xl font-bold text-gray-400 flex-1`}>
              {pod.pod_name}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Functionality to re-include the pod if needed
              }}
            >
              <Text style={tw`text-green-500 text-xl`}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </>
    );
  };

  return (
    <ScrollView style={tw`flex-1 p-4 bg-${theme.colors.background}`}>
      <CustomInput
        label="Pod Name"
        value={newPod.pod_name}
        onChangeText={text => setNewPod({...newPod, pod_name: text})}
      />
      <CustomInput
        label="Image URL"
        value={newPod.image_url}
        onChangeText={text => setNewPod({...newPod, image_url: text})}
      />
      <CustomInput
        label="Max Capacity"
        value={newPod.max_capacity}
        onChangeText={text => setNewPod({...newPod, max_capacity: text})}
        keyboardType="numeric"
      />
      <CustomInput
        label="Discord"
        value={newPod.discord}
        onChangeText={text => setNewPod({...newPod, discord: text})}
      />
      <CustomInput
        label="Email"
        value={newPod.email}
        onChangeText={text => setNewPod({...newPod, email: text})}
      />
      <CustomInput
        label="Steam"
        value={newPod.steam}
        onChangeText={text => setNewPod({...newPod, steam: text})}
      />
      <View style={tw`mt-4`}>
        <Text style={tw`text-lg font-bold mb-2`}>Tags</Text>
        <TagCloud
          tags={newPod.tags.map(tag => ({
            ...tag,
            is_included: tag.is_included,
          }))}
          onToggleTag={tagId => {
            setNewPod(prevPod => ({
              ...prevPod,
              tags: prevPod.tags.map(tag => ({
                ...tag,
                is_included:
                  tag.tag_id === tagId ? !tag.is_included : tag.is_included,
              })),
            }));
          }}
        />
      </View>
      <CustomButton title="Create Pod" onPress={handleCreatePod} />
      {renderPods()}
      {renderDismissedPods()}
    </ScrollView>
  );
};

export default PodsOverview;