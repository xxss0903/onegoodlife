import {Text, TouchableOpacity, View} from 'react-native';
import {logi} from '../utils/logutil';
import React from 'react';

export const renderTagList = (
  tags,
  selectedTags,
  callback,
  isView = false,
  isMultiSelect = false,
) => {
  let tagView = tags.map((value, index) => {
    let selected = false;
    if (isView) {
      selected = true;
    } else {
      if (selectedTags && selectedTags.length > 0) {
        selected = selectedTags.indexOf(value) >= 0;
      }
    }
    let bgColor = selected ? '#ff0000' : '#ffffff';
    return (
      <TouchableOpacity
        disabled={!callback}
        onPress={() => {
          let tagIndex = selectedTags.indexOf(value);
          logi('tag index', tagIndex + ' # ' + value);
          if (isMultiSelect) {
            // 多选
            if (tagIndex >= 0) {
              // 选中了要去掉
              selectedTags.splice(tagIndex, 1);
            } else {
              // 需要添加
              selectedTags.push(value);
            }
          } else {
            // 单选
            selectedTags.splice(0, selectedTags.length);
            selectedTags.push(value);
          }

          if (callback) {
            callback(value);
          }
        }}
        key={value}
        style={{
          padding: 8,
          backgroundColor: bgColor,
          borderRadius: 12,
          marginRight: 12,
          marginTop: 12,
        }}>
        <Text style={{color: '#333333'}}>{value}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
      {tagView}
    </View>
  );
};
