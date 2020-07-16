go to node_modules/src/react-native-multiple-select/lib/react-native-multi-select.js
go to line ~585 and DELETE the following block of code:
            <View
              style={[styles.inputGroup, styleInputGroup && styleInputGroup]}
            >
              {searchIcon}
              <TextInput
                autoFocus
                onChangeText={this._onChangeInput}
                onSubmitEditing={this._addItem}
                placeholder={searchInputPlaceholderText}
                placeholderTextColor={colorPack.placeholderTextColor}
                underlineColorAndroid="transparent"
                style={[searchInputStyle, { flex: 1 }]}
                value={searchTerm}
                {...textInputProps}
              />
              {hideSubmitButton && (
                <TouchableOpacity onPress={this._submitSelection}>
                  <Icon
                    name="menu-down"
                    style={[
                      styles.indicator,
                      { paddingLeft: 15, paddingRight: 15 }
                    ]}
                  />
                </TouchableOpacity>
              )}
              {!hideDropdown && (
                <Icon
                  name="arrow-left"
                  size={20}
                  onPress={this._clearSelectorCallback}
                  color={colorPack.placeholderTextColor}
                  style={{ marginLeft: 5 }}
                />
              )}
            </View>





when you want to release, running react-native run-android --variant=release doesnt work
-go to android
-set the gradle.properties and set the keystore password
-run gradlew.bat assembleRelease--stacktrace and gradlew.bat installRelease --stacktrace
-find the apk