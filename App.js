import React from 'react';
import {View, TextInput, ImageBackground, TouchableOpacity, Image, StyleSheet, ScrollView, Text, Keyboard, FlatList, AppState, AsyncStorage, Modal, Picker, Dimensions}  from 'react-native';
import generator from './src/generator.js'
import {Mutex, MutexInterface} from 'async-mutex'
import MultiSelect from 'react-native-multiple-select';
import uuid from 'react-native-uuid'

export default class App extends React.Component {
	
	
// ==================================================================
// Rendering

	// This is a 1 page app, the main screen is a parchment-like background with 3 buttons at the top, a scrollable menu on the left, and a text area on the right:
	// Generate button: Makes a new NPC and displays the full text on screen. Has a right portion of button that can be clicked instead of the main generate button to make a STRONG NPC
	// Settings button: A modal displaying checkable-settings for the NPC Generator. Displays when user clicks the gear button and goes away when they click outside the modal
	// Delete button: Red X that removes the currently-displayed character from the character list, and switches to displaying another 
	// Scrollable menu: List of NPC names in front of crests, corresponding to our characters array. when one is clicked, it displays in the text area 
	// Text area: Displays the current NPC info, editable  
	render() {
		return (
			<ImageBackground 
				source={require('./src/Parchment.png')}
				style={this.styles.background}>
				
				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.settingsVisible}
					onRequestClose={()=>{}}>
					
					<TouchableOpacity 
						style={this.styles.modalBackground} 
						onPress={()=>this.showSettings(false)}
						activeOpacity={0.5} />
					
					<ImageBackground
						source={require('./src/plaque.jpg')}
						imageStyle={this.styles.modalImage}
						style={this.styles.modalContent}>
						
						<ScrollView style={this.styles.modalScroll}>
							
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Level</Text>
								<Picker
									selectedValue={this.state[this.state.settingsPage].Level}
									style={this.styles.modalSettingPickerThin}
									onValueChange={(itemValue, itemIndex) => this.setSetting("Level", itemValue, this.state.settingsPage)}
									mode="dropdown" >
									
									<Picker.Item label="0" value={0} />
									<Picker.Item label="1" value={1} />
									<Picker.Item label="2" value={2} />
									<Picker.Item label="3" value={3} />
									<Picker.Item label="4" value={4} />
								</Picker>
							</View>
						
							<View style={[this.styles.modalSettingContainer, this.state[this.state.settingsPage].Level > 0 ? this.styles.hidden : this.styles.visible]}>
								<Text style={this.styles.modalSettingLabel}>Level 0 NPCs have no class!</Text>
							</View>
						
							<View style={[this.styles.modalSettingContainer, this.state[this.state.settingsPage].Level > 0 ? this.styles.visible : this.styles.hidden]}>
								<Text style={this.styles.modalSettingLabel}>Class</Text>
								<Picker
									selectedValue={this.state[this.state.settingsPage].Class}
									style={this.styles.modalSettingPicker}
									onValueChange={(itemValue, itemIndex) => this.setSetting("Class", itemValue, this.state.settingsPage)}
									mode="dropdown" >
									
									<Picker.Item label="Any" value="Any" />
									<Picker.Item label="Artificer" value="Artificer" />
									<Picker.Item label="Barbarian" value="Barbarian" />
									<Picker.Item label="Bard" value="Bard" />
									<Picker.Item label="Cleric" value="Cleric" />
									<Picker.Item label="Druid" value="Druid" />
									<Picker.Item label="Fighter" value="Fighter" />
									<Picker.Item label="Monk" value="Monk" />
									<Picker.Item label="Paladin" value="Paladin" />
									<Picker.Item label="Ranger" value="Ranger" />
									<Picker.Item label="Rogue" value="Rogue" />
									<Picker.Item label="Sorcerer" value="Sorcerer" />
									<Picker.Item label="Warlock" value="Warlock" />
									<Picker.Item label="Wizard" value="Wizard" />
								</Picker>
							</View>
							
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Race</Text>
								<Picker
									selectedValue={this.state[this.state.settingsPage].Race}
									style={this.styles.modalSettingPicker}
									onValueChange={(itemValue, itemIndex) => this.setSetting("Race", itemValue, this.state.settingsPage)}
									mode="dropdown" >
									
									<Picker.Item label="Any" value="Any" />
									<Picker.Item label="Dragonborn" value="Dragonborn" />
									<Picker.Item label="Dwarf" value="Dwarf" />
									<Picker.Item label="Elf" value="Elf" />
									<Picker.Item label="Gnome" value="Gnome" />
									<Picker.Item label="Half-Elf" value="Half-Elf" />
									<Picker.Item label="Halfling" value="Halfling" />
									<Picker.Item label="Half-Orc" value="Half-Orc" />
									<Picker.Item label="Human" value="Human" />
									<Picker.Item label="Seafolk" value="Seafolk" />
									<Picker.Item label="Tabaxi" value="Tabaxi" />
									<Picker.Item label="Tiefling" value="Tiefling" />
								</Picker>
							</View>

							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Use Custom Traits</Text>
								<TouchableOpacity onPress={() => this.setSetting("useCustomTraits", !this.state[this.state.settingsPage].useCustomTraits, this.state.settingsPage)} activeOpacity={0.5}>
									<Image style={this.styles.modalSettingCheckbox} source={this.getCheckbox(this.state[this.state.settingsPage].useCustomTraits)}></Image>
								</TouchableOpacity>
							</View>
							
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Equipment</Text>
								<Picker
									selectedValue={this.state[this.state.settingsPage].Equipment}
									style={this.styles.modalSettingPickerThin}
									onValueChange={(itemValue, itemIndex) => this.setSetting("Equipment", itemValue, this.state.settingsPage)}
									mode="dropdown" >
									
									<Picker.Item label="0" value={0} />
									<Picker.Item label="1" value={1} />
									<Picker.Item label="2" value={2} />
									<Picker.Item label="3" value={3} />
									<Picker.Item label="4" value={4} />
									<Picker.Item label="5" value={5} />
									<Picker.Item label="6" value={6} />
								</Picker>
							</View>
							
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Personality</Text>
								<Picker
									selectedValue={this.state[this.state.settingsPage].Personality}
									style={this.styles.modalSettingPickerThin}
									onValueChange={(itemValue, itemIndex) => this.setSetting("Personality", itemValue, this.state.settingsPage)}
									mode="dropdown" >
									
									<Picker.Item label="0" value={0} />
									<Picker.Item label="1" value={1} />
									<Picker.Item label="2" value={2} />
									<Picker.Item label="3" value={3} />
									<Picker.Item label="4" value={4} />
									<Picker.Item label="5" value={5} />
								</Picker>
							</View>
							
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Appearance</Text>
								<Picker
									selectedValue={this.state[this.state.settingsPage].Appearance}
									style={this.styles.modalSettingPickerThin}
									onValueChange={(itemValue, itemIndex) => this.setSetting("Appearance", itemValue, this.state.settingsPage)}
									mode="dropdown" >
									
									<Picker.Item label="0" value={0} />
									<Picker.Item label="1" value={1} />
									<Picker.Item label="2" value={2} />
									<Picker.Item label="3" value={3} />
									<Picker.Item label="4" value={4} />
									<Picker.Item label="5" value={5} />
								</Picker>
							</View>
							
							
						</ScrollView>
					</ImageBackground>
					
				</Modal>

				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.customizeVisible}
					onRequestClose={()=>{}}>
					
					<TouchableOpacity 
						style={this.styles.modalBackground} 
						onPress={()=>this.showCustomize(false)}
						activeOpacity={0.5} />
					
					<ImageBackground
						source={require('./src/plaque.jpg')}
						imageStyle={this.styles.modalImage}
						style={this.styles.modalContent}>
						
						<ScrollView style={[this.styles.modalScroll, this.state.customizePage == 'default' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'personalities'})}>
								<ImageBackground
									source={require('./src/eye.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>Personalities</Text>
								</ImageBackground>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'appearences'})}>
								<ImageBackground
									source={require('./src/eye.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>Appearences</Text>
								</ImageBackground>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'equipment'})}>
								<ImageBackground
									source={require('./src/eye.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>Equipment</Text>
								</ImageBackground>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'accents'})}>
								<ImageBackground
									source={require('./src/eye.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>Accents</Text>
								</ImageBackground>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'abilities'})}>
								<ImageBackground
									source={require('./src/eye.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>Abilities</Text>
								</ImageBackground>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'races'})}>
								<ImageBackground
									source={require('./src/eye.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>Races</Text>
								</ImageBackground>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'classes'})}>
								<ImageBackground
									source={require('./src/eye.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>Classes</Text>
								</ImageBackground>
							</TouchableOpacity>
						</ScrollView>

						<View style={[this.styles.modalScroll, this.state.customizePage == 'personalities' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editPersonality', newTrait: {Name: ""}, modifyingTrait: -1})}>
								<ImageBackground
									source={require('./src/eye_red.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>New</Text>
								</ImageBackground>
							</TouchableOpacity>
							<FlatList
								data={this.state.customTraits.personalities}
								keyExtractor={this._keyCustomTraits}
								renderItem={this._renderCustomTraits}
								style={this.styles.existingTraits}
								extraData={this.state.customTraits}
							/>
						</View>

						<ScrollView style={[this.styles.modalScroll, this.state.customizePage == 'editPersonality' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'personalities', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>							
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={this.styles.customizeTextInput}
									value={this.state.newTrait.Name}
									onChangeText={(value) => this.setSetting('Name', value, 'newTrait')}
									multiline={false}
									underlineColorAndroid='transparent'
								/>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<TouchableOpacity
									activeOpacity={0.5}
									style={this.styles.saveButton}
									onPress={this.saveTrait}>
									<Text style={this.styles.modalSettingButton}>Save</Text>
								</TouchableOpacity>
								<TouchableOpacity
									activeOpacity={0.5}
									style={[this.styles.deleteButton, this.state.modifyingTrait > -1 ? this.styles.visible : this.styles.hidden]}
									onPress={this.deleteTrait}>
									<Text style={this.styles.modalSettingButtonRed}>Delete</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>

						<View style={[this.styles.modalScroll, this.state.customizePage == 'appearences' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editAppearence', newTrait: {Name: ""}, modifyingTrait: -1})}>
								<ImageBackground
									source={require('./src/eye_red.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>New</Text>
								</ImageBackground>
							</TouchableOpacity>
							<FlatList
								data={this.state.customTraits.appearences}
								keyExtractor={this._keyCustomTraits}
								renderItem={this._renderCustomTraits}
								style={this.styles.existingTraits}
								extraData={this.state.customTraits}
							/>
						</View>

						<ScrollView style={[this.styles.modalScroll, this.state.customizePage == 'editAppearence' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'appearences', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>							
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={this.styles.customizeTextInput}
									value={this.state.newTrait.Name}
									onChangeText={(value) => this.setSetting('Name', value, 'newTrait')}
									multiline={false}
									underlineColorAndroid='transparent'
								/>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<TouchableOpacity
									activeOpacity={0.5}
									style={this.styles.saveButton}
									onPress={this.saveTrait}>
									<Text style={this.styles.modalSettingButton}>Save</Text>
								</TouchableOpacity>
								<TouchableOpacity
									activeOpacity={0.5}
									style={[this.styles.deleteButton, this.state.modifyingTrait > -1 ? this.styles.visible : this.styles.hidden]}
									onPress={this.deleteTrait}>
									<Text style={this.styles.modalSettingButtonRed}>Delete</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
						

						<View style={[this.styles.modalScroll, this.state.customizePage == 'accents' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editAccent', newTrait: {Name: ""}, modifyingTrait: -1})}>
								<ImageBackground
									source={require('./src/eye_red.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>New</Text>
								</ImageBackground>
							</TouchableOpacity>
							<FlatList
								data={this.state.customTraits.accents}
								keyExtractor={this._keyCustomTraits}
								renderItem={this._renderCustomTraits}
								style={this.styles.existingTraits}
								extraData={this.state.customTraits}
							/>
						</View>

						<ScrollView style={[this.styles.modalScroll, this.state.customizePage == 'editAccent' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'accents', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>							
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={this.styles.customizeTextInput}
									value={this.state.newTrait.Name}
									onChangeText={(value) => this.setSetting('Name', value, 'newTrait')}
									multiline={false}
									underlineColorAndroid='transparent'
								/>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<TouchableOpacity
									activeOpacity={0.5}
									style={this.styles.saveButton}
									onPress={this.saveTrait}>
									<Text style={this.styles.modalSettingButton}>Save</Text>
								</TouchableOpacity>
								<TouchableOpacity
									activeOpacity={0.5}
									style={[this.styles.deleteButton, this.state.modifyingTrait > -1 ? this.styles.visible : this.styles.hidden]}
									onPress={this.deleteTrait}>
									<Text style={this.styles.modalSettingButtonRed}>Delete</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
						

						<View style={[this.styles.modalScroll, this.state.customizePage == 'accents' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editAccent', newTrait: {Name: ""}, modifyingTrait: -1})}>
								<ImageBackground
									source={require('./src/eye_red.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>New</Text>
								</ImageBackground>
							</TouchableOpacity>
							<FlatList
								data={this.state.customTraits.accents}
								keyExtractor={this._keyCustomTraits}
								renderItem={this._renderCustomTraits}
								style={this.styles.existingTraits}
								extraData={this.state.customTraits}
							/>
						</View>

						<ScrollView style={[this.styles.modalScroll, this.state.customizePage == 'editAccent' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'accents', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>							
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={this.styles.customizeTextInput}
									value={this.state.newTrait.Name}
									onChangeText={(value) => this.setSetting('Name', value, 'newTrait')}
									multiline={false}
									underlineColorAndroid='transparent'
								/>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<TouchableOpacity
									activeOpacity={0.5}
									style={this.styles.saveButton}
									onPress={this.saveTrait}>
									<Text style={this.styles.modalSettingButton}>Save</Text>
								</TouchableOpacity>
								<TouchableOpacity
									activeOpacity={0.5}
									style={[this.styles.deleteButton, this.state.modifyingTrait > -1 ? this.styles.visible : this.styles.hidden]}
									onPress={this.deleteTrait}>
									<Text style={this.styles.modalSettingButtonRed}>Delete</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
						

						<View style={[this.styles.modalScroll, this.state.customizePage == 'abilities' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editAbility', newTrait: {Name: "", description: "", classReq: [], raceReq: []}, modifyingTrait: -1})}>
								<ImageBackground
									source={require('./src/eye_red.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>New</Text>
								</ImageBackground>
							</TouchableOpacity>
							<FlatList
								data={this.state.customTraits.abilities}
								keyExtractor={this._keyCustomTraits}
								renderItem={this._renderCustomTraits}
								style={this.styles.existingTraits}
								extraData={this.state.customTraits}
							/>
						</View>

						<ScrollView style={[this.styles.modalScroll, this.state.customizePage == 'editAbility' ? this.styles.visible : this.styles.hidden]}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'abilities', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={this.styles.customizeTextInput}
									value={this.state.newTrait.Name}
									onChangeText={(value) => this.setSetting('Name', value, 'newTrait')}
									multiline={false}
									underlineColorAndroid='transparent'
								/>
							</View>
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Description</Text>
								<TextInput
									style={this.styles.customizeTextInput}
									value={this.state.newTrait.description}
									onChangeText={(value) => this.setSetting('description', value, 'newTrait')}
									multiline={false}
									underlineColorAndroid='transparent'
								/>
							</View>
							<MultiSelect
								hideTags
								items={this.state.customTraits.classes.concat(require('./src/Class.js').placeholder)}
								uniqueKey="Name"
								onSelectedItemsChange={ selectedItems => this.setState({ newTrait: {...this.state.newTrait, classReq: selectedItems} }) }
								selectedItems={this.state.newTrait.classReq}
								selectText="Class Specific"
								displayKey="Name"
								submitButtonText="Done"
								styleMainWrapper={this.styles.multiSelect}
								styleDropdownMenuSubsection = {this.styles.multiSelectBackground}
								styleTextDropdown={this.styles.multiSelectText}
								styleTextDropdownSelected={this.styles.multiSelectTextSmall}
							/>
							<MultiSelect
								hideTags
								items={this.state.customTraits.races.concat(require('./src/Race.js').placeholder)}
								uniqueKey="Name"
								onSelectedItemsChange={ selectedItems => this.setState({ newTrait: {...this.state.newTrait, raceReq: selectedItems} }) }
								selectedItems={this.state.newTrait.raceReq}
								selectText="Race Specific"
								displayKey="Name"
								submitButtonText="Done"
								styleMainWrapper={this.styles.multiSelect}
								styleDropdownMenuSubsection = {this.styles.multiSelectBackground}
								styleTextDropdown={this.styles.multiSelectText}
								styleTextDropdownSelected={this.styles.multiSelectTextSmall}
							/>
							<View style={this.styles.modalSettingContainer}>
								<TouchableOpacity
									activeOpacity={0.5}
									style={this.styles.saveButton}
									onPress={this.saveTrait}>
									<Text style={this.styles.modalSettingButton}>Save</Text>
								</TouchableOpacity>
								<TouchableOpacity
									activeOpacity={0.5}
									style={[this.styles.deleteButton, this.state.modifyingTrait > -1 ? this.styles.visible : this.styles.hidden]}
									onPress={this.deleteTrait}>
									<Text style={this.styles.modalSettingButtonRed}>Delete</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>

					</ImageBackground>
				</Modal>
				
				<View style={this.styles.topBar}>
				
					<View style={this.styles.cornerContainer}>
						<TouchableOpacity onPress={this.deleteCharacter}>
							<Image
								source={require('./src/shieldX.png')}
								style={this.styles.smallButton}
							/>
						</TouchableOpacity>
					</View>
			
					<View style={this.styles.bigButtonContainer}>
						<TouchableOpacity onPress={() => this.newCharacter("settingsNew")}>
							<Image
								source={require('./src/signNewSolo.png')}
								style={this.styles.bigButtonLeft}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={()=>this.showSettings(true)}>
							<Image
								source={require('./src/signSmall.png')}
								style={this.styles.bigButtonRight}
							/>
						</TouchableOpacity>
					</View>
				
				
					<View style={this.styles.cornerContainer}>
						<TouchableOpacity onPress={()=>this.showCustomize(true)}>
							<Image
								source={require('./src/shieldGear.png')}
								style={this.styles.smallButton}
							/>
						</TouchableOpacity>
					</View>
				
				</View>
			
				<View style={this.styles.belowTopBar}>
					<FlatList
						data={this.state.characters}
						extraData={this.state.index}
						keyExtractor={this._keyCharacterShield}
						renderItem={this._renderCharacterShield}
						ref={component => this._listScroll = component}
						style={this.styles.leftBar}
					/>
				
					<ScrollView 
						ref={component => this._textScroll = component}
						style={this.styles.rightText}>
						<View style={this.keyboardPadding()}>
							{this.state.showText && 
							<TextInput
								style={this.styles.textArea}
								value={this.state.charText}
								onChangeText={(value) => this.setState({ charText: value })}
								multiline={true}
								ref={component => this._text = component}
								underlineColorAndroid='transparent'
							/>}
						</View>
					</ScrollView>
				
				</View>
				
			</ImageBackground>
		);
	}
	
	//helper function for rendering list of characters
	_renderCharacterShield = ({item, index}) => {
		var crestSrc = require('./src/crest.png');
		if(index == this.state.index) crestSrc = require('./src/crestHighlight.png');
		
		return (
		<FlatListItem myIndex={index} stateIndex={this.state.index}>
			<TouchableOpacity
				onPress={() => this.showCharacter(index, true)}
				style={this.styles.listButton}
				shouldRasterizeIOS={true}
				renderToHardwareTextureAndroid={true}>

				<ImageBackground
					source={crestSrc}
					imageStyle={this.styles.listImage}
					style={this.styles.listBackground}>
						
					<Text 
						style={this.styles.listText}
						numberOfLines={3}
						textBreakStrategy='simple'>
						{this.getDisplayName(item)}
					</Text>
				
				</ImageBackground>
			</TouchableOpacity>
		</FlatListItem>
		);
	}
	
	//helper function for getting keys for character list
	_keyCharacterShield = (item, index) => {
		return this.hashCode(item)+"";
	}

	//helper function for rendering list of custom traits
	_renderCustomTraits = ({item, index}) => {		
		return (
		<FlatListItemTraits>
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => this.editTrait(item, index)}>
				<ImageBackground
					source={require('./src/eye.png')}
					imageStyle={this.styles.modalImage}
					style={this.styles.eyeButton}>
						<Text style={this.styles.modalSettingLabel}>{item.Name || item}</Text>
				</ImageBackground>
			</TouchableOpacity>
		</FlatListItemTraits>
		);
	}
	
	//helper function for getting keys for custom traits list
	// assumes all custom traits have a Name prop
	_keyCustomTraits = (item, index) => {
		let str = item
		if (item.Name) str = item.Name
		return this.hashCode(str)+"";
	}
	
	//helper function for determining list item keys
	hashCode(string) {
		var hash = 0, i, chr;
		if (string.length === 0) return hash;
		for (i = 0; i < string.length; i++) {
			chr   = string.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};
	
	//helper function for displaying name
	getDisplayName(string) {
		//get the first line of the text, then split on Name:
		var nameArr = string.split('\n')[0].split('Name:');
		//if there was a Name:
		if(nameArr.length > 1){
			//skip over it to index 1, get rid of white space around the actual name, only take the first name, trim again to be safe, take first 10 letters
			return nameArr[1].trim().split(' ')[0].trim().slice(0, 10);
		}
		//if not
		else{
			//get rid of white space around the actual name, only take the first name, trim again to be safe, take first 10 letters
			return nameArr[0].trim().split(' ')[0].trim().slice(0, 10);
		}
	};

	editTrait (item, index) {
		// remember index so we can update it
		this.setState({modifyingTrait: index})
		// convert generator-usable trait into editable trait
		if (this.state.customizePage === 'personalities') {
			this.setState({
				newTrait: {
					Name: item.Name
				},
				customizePage: "editPersonality"
			})
		}
		if (this.state.customizePage === 'appearences') {
			this.setState({
				newTrait: {
					Name: item.Name
				},
				customizePage: "editAppearence"
			})
		}
		if (this.state.customizePage === 'accents') {
			this.setState({
				newTrait: {
					Name: item
				},
				customizePage: "editAccent"
			})
		}
	}
	
	
	//helper function to underline "New" in modal
	getSettingsNewImage(){
		var img = require('./src/wordsNew.png');
		if(this.state.settingsPage === "settingsNew"){
			img = require('./src/wordsNewUnderline.png')
		}
		
		return img;
	}
	
	//helper function to underline "+" in modal
	getSettingsPlusImage(){
		var img = require('./src/words+.png');
		if(this.state.settingsPage === "settingsPlus"){
			img = require('./src/words+Underline.png')
		}
		
		return img;
	}
	
	//helper function to provide padding when keyboard is shown 
	keyboardPadding(){
		if(this.state.keyboardShowing) return {paddingBottom:this.state.keyboardHeight};
		else return {};
	}
  
  
  
  
  
// ==================================================================
// Functions

	// charText represents the current character displayed on screen 
	// index represents the index that character is in characters
	// characters represents the list of all characters we have displayed in the left list
	// showText is a hack because of a React Native bug, it's used to hide the TextInput when there are no characters
	// settingsVisible controls the settings modal's visibility
	// settings is an object containing attributes past to the generator which controls whether certain races, classes, etc are available. 
	constructor(){
		super();
		this.state = {
			charText: "",
			index: -1,
			characters: [],
			showText: false,
			settingsVisible: false,
			customizeVisible: false,
			modifyingTrait: -1,
			customizePage: 'default',
			newTrait: {},
			customTraits: {
				personalities: [], // Name
				accents: [], // Name
				appearences: [], // Name
				equipment: [], // Name, description (optional), class req (optional, checklist, pulls from customs too)
				abilities: [], // Name, description (optional), class req (optional, checklist, pulls from customs too)
				races: [], // Name, stat buff major (dropdown), stat buff minor (dropdown), ability (string)
				classes: [], // Name, stat req major (dropdown), stat req minor (dropdown), ability (string), weapon (dropdown), armor (dropdown)
			},
			settingsPage: "settingsNew",
			settingsNew: {
				Class: "Any",
				Race: "Any",
				Equipment: 3,
				Level: 0,
				Personality: 2,
				Appearance: 2,
				useCustomTraits: true
			},
			settingsPlus: {
				Class: "Any",
				Race: "Any",
				Equipment: 4,
				Level: 1,
				Personality: 2,
				Appearance: 2,
				useCustomTraits: true
			},
			keyboardShowing: false,
			keyboardHeight: 0
		};
		
		this.newCharacter = this.newCharacter.bind(this);
		this.showCharacter = this.showCharacter.bind(this);
		this.deleteCharacter = this.deleteCharacter.bind(this);
		this.showSettings = this.showSettings.bind(this);
		this.setSetting = this.setSetting.bind(this);
		this.showCustomize = this.showCustomize.bind(this);
		this.saveTrait = this.saveTrait.bind(this);
		this.deleteTrait = this.deleteTrait.bind(this);
	
		AsyncStorage.getItem("characters", (error, result) => {
			if(result && !error) this.setState({characters: JSON.parse(result), showText: true});
		});/*
		AsyncStorage.getItem("traits", (error, result) => {
			if(result && !error) this.setState({customTraits: JSON.parse(result)});
		});*/
	}
	
	//only 1 function may run at once
	mutex = new Mutex();
	
	// simple, generate a character at the given level, add them to our list, display them
	newCharacter(settingsPage) {
		if(!this.mutex.isLocked()){
			this.mutex.acquire().then(release=>{
				this.saveCharacter();
				// default empty custom traits
				let additionalTraits = {
					personalities: [],
					accents: [],
					appearences: [], 
					equipment: [],
					abilities: [],
					races: [],
					classes: [],
				}
				// user enabled custom traits, fetch them
				if (this.state[settingsPage].useCustomTraits) additionalTraits = this.state.customTraits
				// generate given our options
				var newChar = generator(this.state[settingsPage], additionalTraits);
				var newArray = this.state.characters.concat(newChar);
			
				this.setState({
					charText: newChar,
					characters: newArray,
					index: newArray.length-1,
					showText: true
				});
			
				this.refreshText();
				setTimeout(()=>{
					this._listScroll.scrollToEnd({animated:false});
					release();
				}, 50);
			});
		}
	}
	
	// switch to displaying the character at the provided index
	showCharacter(index, save) {
		if(!this.mutex.isLocked()){
			this.mutex.acquire().then(release=>{
				if(save){
					this.saveCharacter();
				}
				var newChar = this.state.characters[index];
		
				this.setState({
					charText: newChar,
					index: index
				}, ()=>{
					
					this.refreshText();
					release();
				});
			});
		}
	}
	
	// remove the currently displayed character from the list 
	// then, check if there's a character after it in the list and display that
	// if not, check to see if there's a character before it in the list and display that
	// if not, reset display to nothing and index to -1
	deleteCharacter() {
		if(!this.mutex.isLocked()){
			this.mutex.acquire().then(release=>{
				// do nothing if list is empty
				if(this.state.index != -1){
					
					// remove element without mutating characters using this hack
					var newArray = this.state.characters.slice();
					newArray.splice(this.state.index, 1);
		
					// update
					this.setState({
						characters: newArray
						}, ()=>{
				
						// check after it
						if(this.state.characters.length > this.state.index){
							release();
							this.showCharacter(this.state.index, false);
						}
				
						else{
							// check before it
							if(this.state.index-1 >= 0){
								release();
								this.showCharacter(this.state.index-1, false);
							}
					
							// reset
							else{
								// For some reason clearing the text of the textInput causes insane lag spikes. No clue why, so I hack around it
								this.setState({
									showText: false
								}, ()=> {
									this.state.charText = "";
									this.state.index = -1;
									this.refreshText();
									release();
								});
							}
						}
					});
				}
			
				// list is empty
				else{
					release();
				}
			});
		}
		
	}
	
	// record any changes the user made to a character before displaying another
	saveCharacter() {
		if(this.state.index != -1){
			this.state.characters[this.state.index] = this.state.charText;
		}
	}
	
	// move scrollview to the top and remove focus/keyboard
	refreshText() {
		if(this._text){
			this._textScroll.scrollTo({y: 0, animated: false});
			this._text.blur()
		}
	}
	
	
	// displys the settings modal when the user clicks the gear icon
	showSettings(show) {
		this.setState({settingsVisible: show});
	}
	
	
	// displys the settings modal when the user clicks the gear icon
	showCustomize(show) {
		this.setState({customizeVisible: show});
		this.setState({customizePage: 'default'});
	}
	
	
	// sets the given setting to the given value
	// note this could cause loss of data if multiple setStates are stacked, but that's almost impossible for our application
	setSetting(name, value, whichSetting){
		this.setState({
			[whichSetting]: {
				...this.state[whichSetting],
				[name]: value
			}
		});
	}
	
	
	//when the app is suspended/closed, save all data
	_handleAppStateChange = (nextAppState) => {
		if (nextAppState.match(/inactive|background/)){
			this.saveCharacter();
			AsyncStorage.setItem("characters", JSON.stringify(this.state.characters));
			AsyncStorage.setItem("traits", JSON.stringify(this.state.customTraits));
		}
	} 
	
	_keyboardDidShow = (e) => {
		this.setState({keyboardShowing: true, keyboardHeight:e.endCoordinates.height})
	}

	_keyboardDidHide = () => {
		this.setState({keyboardShowing: false})
	}

	componentDidMount() {
		AppState.addEventListener('change', this._handleAppStateChange);
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	getCheckbox(bool){
		var checkBox = require('./src/empty_checkbox.png');
		if(bool) checkBox = require('./src/full_checkbox.png');
		
		return checkBox;
	}

	saveTrait () {
		// generate a unique id to represent this trait. this will be used to ensure its not duplicated in a character
		// as well as allows other traits to rely on it 
		let id = uuid.v4()
		if (this.state.customizePage === "editPersonality") {
			//validate
			if (!this.state.newTrait.Name) return
			//this means we're editing a trait, remove the old one
			if (this.state.modifyingTrait > -1) {
				// preserve the id
				id = this.state.customTraits.personalities[this.state.modifyingTrait].id
				this.state.customTraits.personalities.splice(this.state.modifyingTrait, 1)
			}
			//add the new trait/version
			this.state.customTraits.personalities.unshift({
				Reroll: 0,
				Description: this.state.newTrait.Name,
				Properties: [],
				Incompatible: [],
				Name: this.state.newTrait.Name,
				id,
			})
			let traitsClone = {
				...this.state.customTraits
			}
			//go back in modal
			this.setState({customizePage: "personalities", newTrait: {}, modifyingTrait: -1, customTraits: traitsClone})
		}
		if (this.state.customizePage === "editAppearence") {
			//validate
			if (!this.state.newTrait.Name) return
			//this means we're editing a trait, remove the old one
			if (this.state.modifyingTrait > -1) {
				// preserve the id
				id = this.state.customTraits.appearences[this.state.modifyingTrait].id
				this.state.customTraits.appearences.splice(this.state.modifyingTrait, 1)
			}
			//add the new trait/version
			this.state.customTraits.appearences.unshift({
				Reroll: 0,
				Description: this.state.newTrait.Name,
				Properties: [],
				Incompatible: [],
				Name: this.state.newTrait.Name,
				id,
			})
			let traitsClone = {
				...this.state.customTraits
			}
			//go back in modal
			this.setState({customizePage: "appearences", newTrait: {}, modifyingTrait: -1, customTraits: traitsClone})
		}
		if (this.state.customizePage === "editAccent") {
			//validate
			if (!this.state.newTrait.Name) return
			//this means we're editing a trait, remove the old one
			if (this.state.modifyingTrait > -1) this.state.customTraits.accents.splice(this.state.modifyingTrait, 1)
			//add the new trait/version
			this.state.customTraits.accents.unshift(this.state.newTrait.Name)
			let traitsClone = {
				...this.state.customTraits
			}
			//go back in modal
			this.setState({customizePage: "accents", newTrait: {}, modifyingTrait: -1, customTraits: traitsClone})
		}
	}

	deleteTrait () {
		let page
		if (this.state.customizePage === "editPersonality") {
			this.state.customTraits.personalities.splice(this.state.modifyingTrait, 1)
			page = "personalities"
		}
		if (this.state.customizePage === "editAccent") {
			this.state.customTraits.accents.splice(this.state.modifyingTrait, 1)
			page = "accents"
		}
		if (this.state.customizePage === "editAppearence") {
			this.state.customTraits.appearences.splice(this.state.modifyingTrait, 1)
			page = "appearences"
		}
		let traitsClone = {
			...this.state.customTraits
		}
		//go back in modal
		this.setState({customizePage: page, newTrait: {}, modifyingTrait: -1, customTraits: traitsClone})
	}
	
	
	
// ==================================================================
// Styles
 d = Dimensions.get("window")

	styles = StyleSheet.create({
		background: {
			width: this.d.width,
			height: this.d.height,
			flexDirection: 'column'
		},
		
		//
		topBar: {
			flexDirection: 'row', 
			width: '100%',
		},
		
		cornerContainer: {
			width: '20%',
			justifyContent: 'center',
			alignItems: 'center'
		},
		
		//X and gear icon
		smallButton: {
			width: 70,
			height: 70,
			marginTop: 40,
			marginRight: 'auto',
			marginLeft: 'auto',
			resizeMode: 'contain',
		},
		
		//full new+ sign
		bigButtonContainer: {
			flexDirection: 'row', 
			width: '60%',
			justifyContent: 'center',
		},
		
		//left side of new+ sign 
		bigButtonLeft: {
			width: 147,
			height: 140,
			resizeMode: 'contain',
		},
		
		//right side of new+ sign
		bigButtonRight: {
			width: 53,
			height: 120,
			resizeMode: 'contain',
		},
		
		belowTopBar: {
			width: '100%',
			height: this.d.height - 140,
			flexDirection: 'row',
			paddingBottom: 50
		},
		
		rightText: {
			width: '80%'
		},
		
		//where the curChar text is displayed and edited 
		textArea: {
			width: '100%', 
			height: '100%', 
			paddingRight: 25,
			paddingLeft: 25,
			paddingTop: 25,
			margin: 0,
			fontSize: 16,
		},

		customizeTextInput: {
			width: '100%', 
			height: 50,
			fontSize: 16,
			borderWidth: 1,
			borderColor: '#ffffff',
			color: '#ffffff',
		},
		
		leftBar: {
			flexDirection: 'column', 
			width: '20%'
		},
		
		existingTraits: {
			flexDirection: 'column', 
			width: '100%',
			height: 200
		},

		listButton: {
			width: 80,
			height: 80,
			marginTop: 25,
			marginRight: 'auto',
			marginLeft: 'auto',
		},

		listImage: {
			resizeMode: 'contain',
		},
		
		listBackground: {
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center'
		},
		
		listText: {
			width: 42,
			fontSize: 16,
			paddingBottom: 10,
			textShadowColor: '#990000',
			textShadowOffset: {width: 2, height: 2},
			color: '#ffffff',
			textAlign: 'center',
		},
		
		modalBackground: {
			width: '100%',
			height: '100%',
			backgroundColor : '#000000',
			opacity: 0.5
		},
		
		modalContent: {
			width: 250,
			height: 375,
			left: '50%',
			marginLeft: -125,
			top: '50%',
			marginTop: -187.5,
			position: 'absolute'
		},
		
		modalImage: {
			resizeMode: 'stretch',
		},
		
		modalScroll: {
			width: '100%',
			marginBottom: 25,
			marginTop: 27,
			paddingLeft: 23,
			paddingRight: 23
		},
		
		modalSettingsNewPlus: {
			marginTop: 27,
			paddingLeft: 23,
			paddingRight: 23,
			paddingBottom: 5,
			width: '100%',
			justifyContent: 'space-around',
			flexDirection: 'row', 	
			alignItems: 'center'		
		},
		
		modalSettingsNew: {
			width: 100,		
			resizeMode: 'contain'
		},
		
		modalSettingsPlus: {
			width: 33,
			resizeMode: 'contain'
		},
		
		modalSettingContainer: {
			paddingTop: 10,
			paddingBottom: 5,
			width: '100%',
			justifyContent: 'space-between',
			flexDirection: 'row', 
			overflow: 'hidden'
		},
		
		customizeSettingContainer: {
			paddingTop: 10,
			paddingBottom: 5,
			width: '100%',
			flexDirection: 'column', 
			overflow: 'hidden'
		},
		
		eyeButton: {
			margin: 10,
			paddingRight: 15,
			width: '100%',
			height: 50,
			alignItems: 'center',
			justifyContent: 'center',
			overflow: 'hidden'
		},

		visible: {
			display: 'flex'
		},

		hidden: {
			display: 'none'
		},
		
		modalSettingLabel: {
			fontSize: 20,
			textShadowColor: '#990000',
			textShadowOffset: {width: 2, height: 2},
			color: '#ffffff',
		},

		backButton: {
			width: 100,
			paddingLeft: 10,
			paddingTop: 8,
			marginBottom: 10,
		},

		saveButton: {
			width: 100,
			paddingLeft: 10,
			paddingTop: 5,
			marginBottom: 5,
		},

		deleteButton: {
			width: 70,
			paddingTop: 5,
			marginBottom: 5,
		},
		
		modalSettingButton: {
			fontSize: 20,
			textShadowColor: '#990000',
			textShadowOffset: {width: 2, height: 2},
			color: '#ffffff',
			textDecorationLine: 'underline'
		},

		modalSettingButtonRed: {
			fontSize: 20,
			color: '#a21414',
			fontWeight: 'bold',
			textDecorationLine: 'underline'
		},
		
		modalSettingPicker: {
			width: 120,
			margin: 0,
			padding: 0,
			marginTop: -15,
			height: 60,
			color: '#ffffff',
			transform: [
				{ scaleX: 1.25 }, 
				{ scaleY: 1.25 },
			]
		},
		
		modalSettingPickerThin: {
			width: 80,
			margin: 0,
			padding: 0,
			marginTop: -8,
			height: 40,
			color: '#ffffff',
			transform: [
				{ scaleX: 1.25 }, 
				{ scaleY: 1.25 },
			]
		},

		modalSettingCheckbox: {
			width: 30,
			height: 30,
			resizeMode: 'stretch',
			opacity: 1
		},

		multiSelect: {
			marginTop: 15,
		},

		multiSelectBackground: {
			backgroundColor: 'transparent'
		},

		multiSelectText: {
			color: '#ffffff',
			fontSize: 20,
		},

		multiSelectTextSmall: {
			color: '#ffffff',
			fontSize: 14,
		},
	});
	
  
}

 class FlatListItem extends React.Component {
	render() {
		return (
		<View>
			{this.props.children}
		</View>
		)
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		if((nextProps.stateIndex == nextProps.myIndex) || 
			(this.props.stateIndex == this.props.myIndex) ||
			(this.props.myIndex != nextProps.myIndex)){
			return true;
		}
		
		return false;
	}
}
class FlatListItemTraits extends React.Component {
	render() {
		return (
		<View>
			{this.props.children}
		</View>
		)
	}
	
	// TODO optomize 
	shouldComponentUpdate(nextProps, nextState) {		
		return true;
	}
}

  
  
  
  /* Unused functionality
  
  
  <View style={this.styles.modalHeaderContainer}>
								<Text style={this.styles.modalHeaderLabel}>Class</Text>
								<TouchableOpacity onPress={()=>this.toggleGroupSetting("Class")} activeOpacity={0.5}>
									<Image style={this.styles.modalHeaderInput} source={this.getCheckbox("Class")}></Image>
								</TouchableOpacity>
							</View>
							
							{this.getToggleOption("Artificer")}
							{this.getToggleOption("Barbarian")}
							{this.getToggleOption("Bard")}
							{this.getToggleOption("Cleric")}
							{this.getToggleOption("Druid")}
							{this.getToggleOption("Fighter")}
							{this.getToggleOption("Monk")}
							{this.getToggleOption("Paladin")}
							{this.getToggleOption("Ranger")}
							{this.getToggleOption("Rogue")}
							{this.getToggleOption("Sorcerer")}
							{this.getToggleOption("Warlock")}
							{this.getToggleOption("Wizard")}
							
							
							
							
  
  
  	//helper function for determining whether to show checked or unchecked box in modal options
	getCheckbox(name){
		var checkBox = require('./src/empty_checkbox.png');
		if(this.state.settings[name]) checkBox = require('./src/full_checkbox.png');
		
		return checkBox;
	}
	
	//helper function for getting a standard toggle setting option. Assumes this.state.settings[name] is a boolean
	getToggleOption(name){
		return (
			<View style={this.styles.modalOptionContainer}>
				<Text style={this.styles.modalOptionLabel}>{name}</Text>
				<TouchableOpacity onPress={()=>this.toggleSetting(name)} activeOpacity={0.5}>
					<Image style={this.styles.modalOptionInput} source={this.getCheckbox(name)} />
				</TouchableOpacity>
			</View>
		);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// toggles the given option in our settings object
	// note this could cause loss of data if multiple setStates are stacked, but that's almost impossible for our application
	toggleSetting(name){
		this.setState({
			settings: {
				...this.state.settings,
				[name]: !this.state.settings[name]
			}
		});
	}
	
	// toggles the given option in our settings object
	// note this could cause loss of data if multiple setStates are stacked, but that's almost impossible for our application
	toggleGroupSetting(name){
		
		if(name == "Class"){
			var setThem = !this.state.settings.Class;
			
			this.setState({
				settings: {
					...this.state.settings,
					Class: setThem,
					Artificer: setThem,
					Barbarian: setThem,
					Bard: setThem,
					Cleric: setThem,
					Druid: setThem,
					Fighter: setThem,
					Monk: setThem,
					Paladin: setThem,
					Ranger: setThem,
					Rogue: setThem,
					Sorcerer: setThem,
					Warlock: setThem,
					Wizard: setThem,
				}
			});
		}
		
	}
	
	
	
	
	
	
	
	
	
		
		modalHeaderContainer: {
			paddingTop: 15,
			width: '100%',
			justifyContent: 'space-between',
			flexDirection: 'row', 
		},
		
		modalHeaderLabel: {
			fontSize: 20,
			textShadowColor: '#990000',
			textShadowOffset: {width: 2, height: 2},
			color: '#ffffff',
		},
		
		modalHeaderInput: {
			width: 30,
			height: 30,
			resizeMode: 'stretch'
		},
		
		modalOptionContainer: {
			width: '100%',
			justifyContent: 'space-between',
			flexDirection: 'row', 
		},
		
		modalOptionLabel: {
			fontSize: 16,
			paddingLeft: 20,
			textShadowColor: '#990000',
			textShadowOffset: {width: 2, height: 2},
			color: '#ffffff',
		},
		
		modalOptionInput: {
			width: 30,
			height: 30,
			resizeMode: 'stretch',
			opacity: 1
		},
	
	*/
