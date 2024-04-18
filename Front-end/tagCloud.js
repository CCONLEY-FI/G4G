import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import tw from 'twrnc';
import theme from './theme.js';

const TagCloud = ({tags, onToggleTag}) => {
  return (
    <View style={[styles.container, tw`flex-row flex-wrap`]}>
      {tags.map(tag => (
        <TouchableOpacity
          key={tag.tag_id}
          onPress={() => onToggleTag(tag.tag_id)}
          style={[
            styles.tagContainer,
            tag.is_included ? styles.includedTag : styles.notIncludedTag,
          ]}>
          <Text
            style={[
              styles.tagText,
              tag.is_included
                ? styles.includedTagText
                : styles.notIncludedTagText,
            ]}>
            {tag.tag_name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  tagContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
  },
  includedTag: {
    backgroundColor: theme.colors.blue200,
  },
  notIncludedTag: {
    backgroundColor: theme.colors.gray200,
  },
  tagText: {
    fontSize: 16,
  },
  includedTagText: {
    color: theme.colors.black,
  },
  notIncludedTagText: {
    color: theme.colors.gray500,
  },
});

export default TagCloud;
