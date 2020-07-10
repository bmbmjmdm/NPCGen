import React from 'react';
import {View, TextInput, ImageBackground, TouchableOpacity, Image, StyleSheet, ScrollView, Text, Keyboard, FlatList, AppState, AsyncStorage, Modal, Picker, Dimensions, Alert }  from 'react-native';
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
				
				{this.state.messages.intro && this.state.loaded && <View style={this.styles.overlay} />}
				
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
									{this.state.customTraits.classes.map(clas => {
										return (
											<Picker.Item label={clas.Name} value={clas.id} />
										);
									})}
									<Picker.Item label="Artificer" value="artificer" />
									<Picker.Item label="Barbarian" value="barbarian" />
									<Picker.Item label="Bard" value="bard" />
									<Picker.Item label="Cleric" value="cleric" />
									<Picker.Item label="Druid" value="druid" />
									<Picker.Item label="Fighter" value="fighter" />
									<Picker.Item label="Monk" value="monk" />
									<Picker.Item label="Paladin" value="paladin" />
									<Picker.Item label="Ranger" value="ranger" />
									<Picker.Item label="Rogue" value="rogue" />
									<Picker.Item label="Sorcerer" value="sorcerer" />
									<Picker.Item label="Warlock" value="warlock" />
									<Picker.Item label="Wizard" value="wizard" />
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
									{this.state.customTraits.races.map(race => {
										return (
											<Picker.Item label={race.Name} value={race.id} />
										);
									})}
									<Picker.Item label="Dragonborn" value="dragonborn" />
									<Picker.Item label="Dwarf" value="dwarf" />
									<Picker.Item label="Elf" value="elf" />
									<Picker.Item label="Gnome" value="gnome" />
									<Picker.Item label="Half-Elf" value="half-elf" />
									<Picker.Item label="Halfling" value="halfling" />
									<Picker.Item label="Half-Orc" value="half-orc" />
									<Picker.Item label="Human" value="human" />
									<Picker.Item label="Seafolk" value="seafolk" />
									<Picker.Item label="Tabaxi" value="tabaxi" />
									<Picker.Item label="Tiefling" value="tiefling" />
								</Picker>
							</View>
						
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>User{"\n"}Content</Text>
								<Picker
									selectedValue={this.state[this.state.settingsPage].customRate}
									style={this.styles.modalSettingPicker}
									onValueChange={(itemValue, itemIndex) => this.setSetting("customRate", itemValue, this.state.settingsPage)}
									mode="dropdown" >
									<Picker.Item label="Not included" value="none" />
									<Picker.Item label="Normal rate" value="normal" />
									<Picker.Item label="Frequently appears" value="frequent" />
								</Picker>
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
						
						{this.state.customizePage == 'default' &&
						<ScrollView style={this.styles.modalScroll}>
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
								onPress={() => this.setState({customizePage: 'accents'})}>
								<ImageBackground
									source={require('./src/eye.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>Accents</Text>
								</ImageBackground>
							</TouchableOpacity>
						</ScrollView>
						}

						{this.state.customizePage == 'personalities' && 
						<View style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editPersonality', validate: false, newTrait: {Name: ""}, modifyingTrait: -1})}>
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
						}

						{this.state.customizePage == 'editPersonality' &&
						<ScrollView style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'personalities', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>							
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={[this.styles.customizeTextInput, this.state.validate && !this.state.newTrait.Name ? this.styles.redOutline : {}]}
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
						}

						{this.state.customizePage == 'appearences' && 
						<View style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editAppearence', validate: false, newTrait: {Name: ""}, modifyingTrait: -1})}>
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
						}


						{this.state.customizePage == 'editAppearence' &&
						<ScrollView style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'appearences', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>							
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={[this.styles.customizeTextInput, this.state.validate && !this.state.newTrait.Name ? this.styles.redOutline : {}]}
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
						}
						
						{this.state.customizePage == 'accents' &&
						<View style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editAccent', validate: false, newTrait: {Name: ""}, modifyingTrait: -1})}>
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
						}

						{this.state.customizePage == 'editAccent' &&
						<ScrollView style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'accents', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>							
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={[this.styles.customizeTextInput, this.state.validate && !this.state.newTrait.Name ? this.styles.redOutline : {}]}
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
						}
						
						{this.state.customizePage == 'abilities' &&
						<View style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editAbility', validate: false, newTrait: {Name: "", description: "", classReq: [], levelReq: 0}, modifyingTrait: -1})}>
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
						}

						{this.state.customizePage == 'editAbility' &&
						<ScrollView style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'abilities', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={[this.styles.customizeTextInput, this.state.validate && !this.state.newTrait.Name ? this.styles.redOutline : {}]}
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
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Min Lvl</Text>
								<Picker
									selectedValue={this.state.newTrait.levelReq}
									style={this.styles.modalSettingPickerThin}
									onValueChange={(itemValue, itemIndex) => this.setSetting("levelReq", itemValue, 'newTrait')}
									mode="dropdown" >
									<Picker.Item label="0" value={0} />
									<Picker.Item label="1" value={1} />
									<Picker.Item label="2" value={2} />
									<Picker.Item label="3" value={3} />
									<Picker.Item label="4" value={4} />
								</Picker>
							</View>
							{/* Read README.txt to modify MultiSelect if you just installed node_modules */}
							<MultiSelect
								hideTags
								items={this.getAllClasses().map(clas => { return {Name: clas.Name, id: clas.Properties[0]}})}
								uniqueKey="id"
								onSelectedItemsChange={ selectedItems => this.setState({ newTrait: {...this.state.newTrait, classReq: selectedItems} }) }
								selectedItems={this.state.newTrait.classReq}
								selectText="Class Specific"
								displayKey="Name"
								submitButtonText="Done"
								styleDropdownMenuSubsection = {this.styles.multiSelectBackground}
								styleTextDropdown={this.styles.multiSelectText}
								styleTextDropdownSelected={this.styles.multiSelectTextSmall}
								searchInputStyle={this.styles.multiSelectSearch}
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
						}
						
						
						{this.state.customizePage == 'equipment' &&
						<View style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editEquipment', validate: false, newTrait: {Name: "", description: "", classReq: [], levelReq: 0}, modifyingTrait: -1})}>
								<ImageBackground
									source={require('./src/eye_red.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>New</Text>
								</ImageBackground>
							</TouchableOpacity>
							<FlatList
								data={this.state.customTraits.equipment}
								keyExtractor={this._keyCustomTraits}
								renderItem={this._renderCustomTraits}
								style={this.styles.existingTraits}
								extraData={this.state.customTraits}
							/>
						</View>
						}

						{this.state.customizePage == 'editEquipment' &&
						<ScrollView style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'equipment', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={[this.styles.customizeTextInput, this.state.validate && !this.state.newTrait.Name ? this.styles.redOutline : {}]}
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
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Min Lvl</Text>
								<Picker
									selectedValue={this.state.newTrait.levelReq}
									style={this.styles.modalSettingPickerThin}
									onValueChange={(itemValue, itemIndex) => this.setSetting("levelReq", itemValue, 'newTrait')}
									mode="dropdown" >
									<Picker.Item label="0" value={0} />
									<Picker.Item label="1" value={1} />
									<Picker.Item label="2" value={2} />
									<Picker.Item label="3" value={3} />
									<Picker.Item label="4" value={4} />
								</Picker>
							</View>
							{/* Read README.txt to modify MultiSelect if you just installed node_modules */}
							<MultiSelect
								hideTags
								items={this.getAllClasses().map(clas => { return {Name: clas.Name, id: clas.Properties[0]}})}
								uniqueKey="id"
								onSelectedItemsChange={ selectedItems => this.setState({ newTrait: {...this.state.newTrait, classReq: selectedItems} }) }
								selectedItems={this.state.newTrait.classReq}
								selectText="Class Specific"
								displayKey="Name"
								submitButtonText="Done"
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
						}

						
						{this.state.customizePage == 'races' &&
						<View style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editRace', validate: false, newTrait: {Name: "", ability: "", primaryStat: "", secondaryStat: ""}, modifyingTrait: -1})}>
								<ImageBackground
									source={require('./src/eye_red.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>New</Text>
								</ImageBackground>
							</TouchableOpacity>
							<FlatList
								data={this.state.customTraits.races}
								keyExtractor={this._keyCustomTraits}
								renderItem={this._renderCustomTraits}
								style={this.styles.existingTraits}
								extraData={this.state.customTraits}
							/>
						</View>
						}

						{this.state.customizePage == 'editRace' &&
						<ScrollView style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'races', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={[this.styles.customizeTextInput, this.state.validate && !this.state.newTrait.Name ? this.styles.redOutline : {}]}
									value={this.state.newTrait.Name}
									onChangeText={(value) => this.setSetting('Name', value, 'newTrait')}
									multiline={false}
									underlineColorAndroid='transparent'
								/>
							</View>
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Ability</Text>
								<View style={this.styles.customizeTextInputLargeFrame}>
									<TextInput
										style={this.styles.customizeTextInputLarge}
										value={this.state.newTrait.ability}
										onChangeText={(value) => this.setSetting('ability', value, 'newTrait')}
										multiline={true}
										underlineColorAndroid='transparent'
									/>
								</View>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Stat +2</Text>
								<View style={this.state.validate && !this.state.newTrait.primaryStat ? this.styles.redOutline : this.styles.transOutline}>
									<Picker
										selectedValue={this.state.newTrait.primaryStat}
										style={this.styles.modalSettingPickerMed}
										onValueChange={(itemValue, itemIndex) => this.setSetting("primaryStat", itemValue, 'newTrait')}
										mode="dropdown" >
										<Picker.Item label="Pick" value="" />
										<Picker.Item label="STR" value="S" />
										<Picker.Item label="CON" value="E" />
										<Picker.Item label="DEX" value="D" />
										<Picker.Item label="WIS" value="W" />
										<Picker.Item label="INT" value="I" />
										<Picker.Item label="CHA" value="C" />
									</Picker>
								</View>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Stat +1</Text>
								<View style={this.state.validate && !this.state.newTrait.secondaryStat ? this.styles.redOutline : this.styles.transOutline}>
									<Picker
										selectedValue={this.state.newTrait.secondaryStat}
										style={this.styles.modalSettingPickerMed}
										onValueChange={(itemValue, itemIndex) => this.setSetting("secondaryStat", itemValue, 'newTrait')}
										mode="dropdown" >
										<Picker.Item label="Pick" value="" />
										<Picker.Item label="STR" value="S" />
										<Picker.Item label="CON" value="E" />
										<Picker.Item label="DEX" value="D" />
										<Picker.Item label="WIS" value="W" />
										<Picker.Item label="INT" value="I" />
										<Picker.Item label="CHA" value="C" />
									</Picker>
								</View>
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
						}

						
						{this.state.customizePage == 'classes' &&
						<View style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'default'})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={() => this.setState({customizePage: 'editClass', validate: false, newTrait: {Name: "", hp: "", primaryStat: "", secondaryStat: "", ability: "", weapon: "", armor: "", base: ""}, modifyingTrait: -1})}>
								<ImageBackground
									source={require('./src/eye_red.png')}
									imageStyle={this.styles.modalImage}
									style={this.styles.eyeButton}>
										<Text style={this.styles.modalSettingLabel}>New</Text>
								</ImageBackground>
							</TouchableOpacity>
							<FlatList
								data={this.state.customTraits.classes}
								keyExtractor={this._keyCustomTraits}
								renderItem={this._renderCustomTraits}
								style={this.styles.existingTraits}
								extraData={this.state.customTraits}
							/>
						</View>
						}

						{this.state.customizePage == 'editClass' &&
						<ScrollView style={this.styles.modalScroll}>
							<TouchableOpacity
								activeOpacity={0.5}
								style={this.styles.backButton}
								onPress={() => this.setState({customizePage: 'classes', modifyingTrait: -1, newTrait: {}})}>
								<Text style={this.styles.modalSettingButton}>Back</Text>
							</TouchableOpacity>
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Name</Text>
								<TextInput
									style={[this.styles.customizeTextInput, this.state.validate && !this.state.newTrait.Name ? this.styles.redOutline : {}]}
									value={this.state.newTrait.Name}
									onChangeText={(value) => this.setSetting('Name', value, 'newTrait')}
									multiline={false}
									underlineColorAndroid='transparent'
								/>
							</View>
							<View style={this.styles.customizeSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Default Ability</Text>
								<View style={this.styles.customizeTextInputLargeFrame}>
									<TextInput
										style={this.styles.customizeTextInputLarge}
										value={this.state.newTrait.ability}
										onChangeText={(value) => {
											this.warnChangingDependents();
											this.setSetting('ability', value, 'newTrait');
										}}
										multiline={true}
										underlineColorAndroid='transparent'
									/>
								</View>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Base</Text>
								<Picker
									selectedValue={this.state.newTrait.base}
									style={this.styles.modalSettingPicker}
									onValueChange={(itemValue, itemIndex) => {
										this.useBaseFirstTime()
										if (!this.checkCircularDepndency(itemValue)){
											this.warnChangingDependents()
											this.setSetting("base", itemValue, 'newTrait', () => {
												this.setClassDefaults(itemValue)
											})
										}
									}}
									mode="dropdown" >
									<Picker.Item label="None" value="" />
									{this.state.customTraits.classes.filter((clas, index) => 
									{ 
										return this.state.modifyingTrait == -1 || this.state.modifyingTrait != index 
									})
									.map((clas, index) => {
										return (
											<Picker.Item label={clas.Name} value={clas.id} />
										);
									})}
									<Picker.Item label="Artificer" value="artificer" />
									<Picker.Item label="Barbarian" value="barbarian" />
									<Picker.Item label="Bard" value="bard" />
									<Picker.Item label="Cleric" value="cleric" />
									<Picker.Item label="Druid" value="druid" />
									<Picker.Item label="Fighter" value="fighter" />
									<Picker.Item label="Monk" value="monk" />
									<Picker.Item label="Paladin" value="paladin" />
									<Picker.Item label="Ranger" value="ranger" />
									<Picker.Item label="Rogue" value="rogue" />
									<Picker.Item label="Sorcerer" value="sorcerer" />
									<Picker.Item label="Warlock" value="warlock" />
									<Picker.Item label="Wizard" value="wizard" />
								</Picker>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Main Stat</Text>
								<View style={this.state.validate && !this.state.newTrait.primaryStat ? this.styles.redOutline : this.styles.transOutline}>
									<Picker
										selectedValue={this.state.newTrait.primaryStat}
										style={this.styles.modalSettingPickerMed}
										onValueChange={(itemValue, itemIndex) => this.setSetting("primaryStat", itemValue, 'newTrait')}
										mode="dropdown" >
										<Picker.Item label="Pick" value="" />
										<Picker.Item label="STR" value="S" />
										<Picker.Item label="CON" value="E" />
										<Picker.Item label="DEX" value="D" />
										<Picker.Item label="WIS" value="W" />
										<Picker.Item label="INT" value="I" />
										<Picker.Item label="CHA" value="C" />
									</Picker>
								</View>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>2nd Stat</Text>
								<View style={this.state.validate && !this.state.newTrait.secondaryStat ? this.styles.redOutline : this.styles.transOutline}>
									<Picker
										selectedValue={this.state.newTrait.secondaryStat}
										style={this.styles.modalSettingPickerMed}
										onValueChange={(itemValue, itemIndex) => this.setSetting("secondaryStat", itemValue, 'newTrait')}
										mode="dropdown" >
										<Picker.Item label="Pick" value="" />
										<Picker.Item label="STR" value="S" />
										<Picker.Item label="CON" value="E" />
										<Picker.Item label="DEX" value="D" />
										<Picker.Item label="WIS" value="W" />
										<Picker.Item label="INT" value="I" />
										<Picker.Item label="CHA" value="C" />
									</Picker>
								</View>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Weapon</Text>
								<View style={this.state.validate && !this.state.newTrait.weapon ? this.styles.redOutline : this.styles.transOutline}>
									<Picker
										selectedValue={this.state.newTrait.weapon}
										style={this.styles.modalSettingPickerMed}
										onValueChange={(itemValue, itemIndex) => this.setSetting("weapon", itemValue, 'newTrait')}
										mode="dropdown" >
										<Picker.Item label="Pick" value="" />
										<Picker.Item label="None" value="none" />
										<Picker.Item label="One-handed Melee" value="one-melee" />
										<Picker.Item label="Two-handed Melee" value="two-melee" />
										<Picker.Item label="Finesse Melee" value="finesse-melee" />
										<Picker.Item label="Bows" value="bows" />
										<Picker.Item label="Magic" value="magic" />
										<Picker.Item label="Instruments" value="instrument" />
									</Picker>
								</View>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Armor</Text>
								<View style={this.state.validate && !this.state.newTrait.armor ? this.styles.redOutline : this.styles.transOutline}>
									<Picker
										selectedValue={this.state.newTrait.armor}
										style={this.styles.modalSettingPickerMed}
										onValueChange={(itemValue, itemIndex) => this.setSetting("armor", itemValue, 'newTrait')}
										mode="dropdown" >
										<Picker.Item label="Pick" value="" />
										<Picker.Item label="None" value="none" />
										<Picker.Item label="Light" value="light" />
										<Picker.Item label="Medium" value="medium" />
										<Picker.Item label="Heavy" value="heavy" />
									</Picker>
								</View>
							</View>
							<View style={this.styles.modalSettingContainer}>
								<Text style={this.styles.modalSettingLabel}>Hit Die</Text>
								<View style={this.state.validate && !this.state.newTrait.hp ? this.styles.redOutline : this.styles.transOutline}>
									<Picker
										selectedValue={this.state.newTrait.hp}
										style={this.styles.modalSettingPickerMed}
										onValueChange={(itemValue, itemIndex) => this.setSetting("hp", itemValue, 'newTrait')}
										mode="dropdown" >
										<Picker.Item label="Pick" value="" />
										<Picker.Item label="d6" value="d6" />
										<Picker.Item label="d8" value="d8" />
										<Picker.Item label="d10" value="d10" />
										<Picker.Item label="d12" value="d12" />
									</Picker>
								</View>
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
									onPress={() => {
										if (this.tryToDeleteClass()) this.deleteTrait()
									}}>
									<Text style={this.styles.modalSettingButtonRed}>Delete</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
						}

					</ImageBackground>
				</Modal>
				
				<View style={this.styles.topBar}>
				
					<View style={[this.styles.cornerContainer, this.state.introStep === 2 ? this.styles.overOverlay : {}]}>
						<TouchableOpacity onPress={this.deleteCharacter}>
							<Image
								source={require('./src/shieldX.png')}
								style={this.styles.smallButton}
							/>
						</TouchableOpacity>
					</View>
			
					<View style={this.styles.bigButtonContainer}>
						<TouchableOpacity onPress={() => this.newCharacter("settingsNew")} style={this.state.introStep === 0 ? this.styles.overOverlay : {}}>
							<Image
								source={require('./src/signNewSolo.png')}
								style={this.styles.bigButtonLeft}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={()=>this.showSettings(true)} style={this.state.introStep === 3 ? this.styles.overOverlay : {}}>
							<Image
								source={require('./src/signSmall.png')}
								style={this.styles.bigButtonRight}
							/>
						</TouchableOpacity>
					</View>
				
				
					<View style={[this.styles.cornerContainer, this.state.introStep === 4 ? this.styles.overOverlay : {}]}>
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
						style={[this.styles.leftBar, this.state.introStep === 1 ? this.styles.overOverlay : {}]}
					/>
				
					<ScrollView 
						ref={component => this._textScroll = component}
						style={[this.styles.rightText, this.state.messages.intro ? this.styles.overOverlay : {}]}>
						<View style={this.keyboardPadding()}>
							{this.state.messages.intro && this.state.loaded &&
								<Text style={this.styles.introText} >
									{this.getIntroText()}
								</Text>
							}
							{this.state.showText && !this.state.messages.intro &&
								<TextInput
									style={this.styles.textArea}
									value={this.state.charText}
									onChangeText={(value) => this.setState({ charText: value })}
									multiline={true}
									ref={component => this._text = component}
									underlineColorAndroid='transparent'
								/>
							}
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
			messages: {
				baseWarning: true,
				classWarning: true,
				intro: true,
			},
			loaded: false,
			introStep: 0,
			validate: false,
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
				customRate: 'normal'
			},
			settingsPlus: {
				Class: "Any",
				Race: "Any",
				Equipment: 4,
				Level: 1,
				Personality: 2,
				Appearance: 2,
				customRate: 'normal'
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
		this.tryToDeleteClass = this.tryToDeleteClass.bind(this)
		this.getAllClasses = this.getAllClasses.bind(this);
		this.saveClassFirstTime = this.saveClassFirstTime.bind(this)
		this.useBaseFirstTime = this.useBaseFirstTime.bind(this)
		this.getIntroText = this.getIntroText.bind(this)
		this.warnChangingDependents = this.warnChangingDependents.bind(this)
		this.updateClassBase = this.updateClassBase.bind(this)
		this.getClassAsNewTrait = this.getClassAsNewTrait.bind(this)
		this.getNewClass = this.getNewClass.bind(this)
		this.setClassDefaults = this.setClassDefaults.bind(this)

		AsyncStorage.getItem("characters", (error, result) => {
			if(result && !error) this.setState({characters: JSON.parse(result), showText: true});
		});
		AsyncStorage.getItem("traits", (error, result) => {
			if(result && !error) this.setState({customTraits: JSON.parse(result)});
		});
		AsyncStorage.getItem("messages", (error, result) => {
			if(result && !error) this.setState({messages: JSON.parse(result)});
			this.setState({loaded: true})
		});
		AsyncStorage.getItem("settings", (error, result) => {
			if(result && !error) this.setState({settingsNew: JSON.parse(result)});
		});
	}
	
	//only 1 function may run at once
	mutex = new Mutex();
	
	// simple, generate a character at the given level, add them to our list, display them
	newCharacter(settingsPage) {
		if(!this.mutex.isLocked()){
			this.mutex.acquire().then(release=>{
				if (this.state.messages.intro) this.setState({introStep: this.state.introStep + 1});
				this.saveCharacter();
				// generate given our options
				var newChar = generator(this.state[settingsPage], this.state.customTraits);
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
				if (this.state.messages.intro && this.state.introStep === 1) this.setState({introStep: this.state.introStep + 1});
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
				if (this.state.messages.intro)  {
					this.setState({introStep: this.state.introStep + 1});
					if (this.state.characters.length > 1) return release()
				}
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
		if (this.state.messages.intro) {
			this.setState({introStep: this.state.introStep + 1});
			return
		}
		this.setState({settingsVisible: show});
	}
	
	
	// displys the settings modal when the user clicks the gear icon
	showCustomize(show) {
		if (this.state.messages.intro) {
			this.setState({messages: {...this.state.messages, intro: false}});
			return
		}
		this.setState({customizeVisible: show});
	}
	
	
	// sets the given setting to the given value
	// note this could cause loss of data if multiple setStates are stacked, but that's almost impossible for our application
	setSetting(name, value, whichSetting, callback){
		this.setState({
			[whichSetting]: {
				...this.state[whichSetting],
				[name]: value
			}
		}, callback);
	}
	
	
	//when the app is suspended/closed, save all data
	_handleAppStateChange = (nextAppState) => {
		if (nextAppState.match(/inactive|background/)){
			this.saveCharacter();
			AsyncStorage.setItem("characters", JSON.stringify(this.state.characters));
			AsyncStorage.setItem("traits", JSON.stringify(this.state.customTraits));
			AsyncStorage.setItem("messages", JSON.stringify(this.state.messages));
			AsyncStorage.setItem("settings", JSON.stringify(this.state.settingsNew));
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

	useBaseFirstTime () {
		if (this.state.messages.baseWarning) {
			this.setState({messages: {...this.state.messages, baseWarning: false}})
			Alert.alert(
				"Base Class",
				"Custom classes inherit all of the base class's abilities. While this gives a nice fleshed-out class to go off of, it can also \"drown out\" your own custom abilities for this class!",
				[
					{ text: "OK", onPress: () => {}}
				],
				{ cancelable: true }
			);
		}
	}

	warnChangingDependents () {
		let dependents = this.getDependents(this.state.newTrait.id)
		if (dependents.length > 0) {
			Alert.alert(
				"Dependent Classes",
				"One or more classes are based on this class. This will affect them if you save.",
				[
					{ text: "OK", onPress: () => {}}
				],
				{ cancelable: true }
			);
		}
	}

	// does not check for dependents of dependents
	getDependents (id) {
		let dependents = []
		for (let clas of this.state.customTraits.classes) {
			if (clas.base) {
				if (clas.base == id) dependents.push(clas)
			}
		}
		return dependents
	}

	checkCircularDepndency (newBase) {
		let circularDependence = this.checkCircDepRecursive(this.state.newTrait.id, newBase)
		if (circularDependence) {
			Alert.alert(
				"Circular Dependency",
				"The class you are trying to base off of is either directly or indirectly based off this one. You cannot make circular dependencies.",
				[
					{ text: "OK", onPress: () => {}}
				],
				{ cancelable: true }
			);
			return true
		}
		else {
			return false
		}
	}

	// id wants to rely on newBase. does newBase rely on id?
	checkCircDepRecursive (id, newBase) {
		if (!id || !newBase) return false
		else {
			// find the new base
			for (let clas of this.state.customTraits.classes) {
				if (clas.id == newBase) {
					// found it
					if (clas.base == id) {
						// exit condition, newBase relies on id
						return true
					}
					else if (clas.base) {
						// newbase doesnt rely on id, but it does rely on another class. does that class rely on id?
						if (this.checkCircDepRecursive(id, clas.base)) {
							// yup, newBase is indirectly based on id
							return true
						}
					}

				}
			}
			return false
		}
	}

	saveClassFirstTime () {
		if (this.state.messages.classWarning) {
			this.setState({messages: {...this.state.messages, classWarning: false}})
			Alert.alert(
				"Custom Class",
				"Congrats on making your first class! You should now navigate to the custom abilities section to create class-specific abilities for this class!",
				[
					{ text: "OK", onPress: () => {}}
				],
				{ cancelable: true }
			);
		}
	}

	saveTrait () {
		// generate a unique id to represent this trait. this will be used to ensure its not duplicated in a character
		// as well as allows other traits to rely on it 
		let id = uuid.v4()
		if (this.state.customizePage === "editPersonality") {
			//validate
			if (!this.state.newTrait.Name) {
				this.setState({validate: true})
				return
			}
			//this means we're editing a trait, remove the old one
			if (this.state.modifyingTrait > -1) {
				// preserve the id
				id = this.state.newTrait.id
				this.state.customTraits.personalities.splice(this.state.modifyingTrait, 1)
			}
			//add the new trait/version
			this.state.customTraits.personalities.unshift({
				Reroll: 0,
				Description: this.state.newTrait.Name,
				Properties: [id],
				Incompatible: [id],
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
			if (!this.state.newTrait.Name) {
				this.setState({validate: true})
				return
			}
			//this means we're editing a trait, remove the old one
			if (this.state.modifyingTrait > -1) {
				// preserve the id
				id = this.state.newTrait.id
				this.state.customTraits.appearences.splice(this.state.modifyingTrait, 1)
			}
			//add the new trait/version
			this.state.customTraits.appearences.unshift({
				Reroll: 0,
				Description: this.state.newTrait.Name,
				Properties: [id],
				Incompatible: [id],
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
			if (!this.state.newTrait.Name) {
				this.setState({validate: true})
				return
			}
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
		if (this.state.customizePage === "editAbility") {
			//validate
			if (!this.state.newTrait.Name) {
				this.setState({validate: true})
				return
			}
			//this means we're editing a trait, remove the old one
			if (this.state.modifyingTrait > -1) {
				// preserve the id
				id = this.state.newTrait.id
				this.state.customTraits.abilities.splice(this.state.modifyingTrait, 1)
			}
			let description = this.state.newTrait.Name + (this.state.newTrait.description ? ": " + this.state.newTrait.description : "")
			let requirements = {
				Level: this.state.newTrait.levelReq,
				Properties: this.state.newTrait.classReq,
			}
			//add the new trait/version
			this.state.customTraits.abilities.unshift({
				Reroll: 0,
				Description: description,
				Properties: [id],
				Incompatible: [id],
				Name: this.state.newTrait.Name,
				Requirements: requirements,
				id,
			})
			let traitsClone = {
				...this.state.customTraits
			}
			//go back in modal
			this.setState({customizePage: "abilities", newTrait: {}, modifyingTrait: -1, customTraits: traitsClone})
		}
		if (this.state.customizePage === "editEquipment") {
			//validate
			if (!this.state.newTrait.Name) {
				this.setState({validate: true})
				return
			}
			//this means we're editing a trait, remove the old one
			if (this.state.modifyingTrait > -1) {
				// preserve the id
				id = this.state.newTrait.id
				this.state.customTraits.equipment.splice(this.state.modifyingTrait, 1)
			}
			let description = this.state.newTrait.Name + (this.state.newTrait.description ? ": " + this.state.newTrait.description : "")
			let requirements = {
				Level: this.state.newTrait.levelReq,
				Properties: this.state.newTrait.classReq,
			}
			//add the new trait/version
			// for some reason equipment does incompatible differently
			this.state.customTraits.equipment.unshift({
				Reroll: 0,
				Description: description,
				Incompatible: description,
				Name: this.state.newTrait.Name,
				Requirements: requirements,
				id,
			})
			let traitsClone = {
				...this.state.customTraits
			}
			//go back in modal
			this.setState({customizePage: "equipment", newTrait: {}, modifyingTrait: -1, customTraits: traitsClone})
		}
		if (this.state.customizePage === "editRace") {
			//validate
			if (!this.state.newTrait.Name || !this.state.newTrait.primaryStat || !this.state.newTrait.secondaryStat) {
				this.setState({validate: true})
				return
			}
			//this means we're editing a trait, remove the old one
			if (this.state.modifyingTrait > -1) {
				// preserve the id
				id = this.state.newTrait.id
				this.state.customTraits.races.splice(this.state.modifyingTrait, 1)
			}
			let Stats = {
				[this.state.newTrait.primaryStat]: 2,
				[this.state.newTrait.secondaryStat]: 1,
			}
			let Abilities = []
			if (this.state.newTrait.ability) {
				Abilities = this.state.newTrait.ability.split("\n")
			}
			// add the new trait/version
			this.state.customTraits.races.unshift({
				Reroll: 0,
				Abilities,
				Name: this.state.newTrait.Name,
				Properties: [id],
				primaryStat: this.state.newTrait.primaryStat,
				secondaryStat: this.state.newTrait.secondaryStat,
				Stats,
				id,
			})
			let traitsClone = {
				...this.state.customTraits
			}
			//go back in modal
			this.setState({customizePage: "races", newTrait: {}, modifyingTrait: -1, customTraits: traitsClone})
		}
		if (this.state.customizePage === "editClass") {
			//validate
			if (!this.state.newTrait.Name || !this.state.newTrait.primaryStat || !this.state.newTrait.secondaryStat
				|| !this.state.newTrait.weapon || !this.state.newTrait.armor || !this.state.newTrait.hp) {
				this.setState({validate: true})
				return
			}
			this.saveClassFirstTime()
			//this means we're editing a trait, remove the old one
			if (this.state.modifyingTrait > -1) {
				// id is preserved by getNewClass
				this.state.customTraits.classes.splice(this.state.modifyingTrait, 1)
			}
			else {
				// add new id
				this.state.newTrait.id = id
			}
			this.state.customTraits.classes.unshift(this.getNewClass(this.state.newTrait))
			let traitsClone = {
				...this.state.customTraits
			}
			// this will get erased by setState so we need to preserve it for updating dependencies
			let preserveId = this.state.newTrait.id
			//go back in modal
			this.setState({customizePage: "classes", newTrait: {}, modifyingTrait: -1, customTraits: traitsClone}, () => {
				// after state has been set, go through all dependents and update them
				for (let clas of this.getDependents(preserveId)) {
					this.updateClassBase(clas)
				}
			})
		}
	}

	// creates a new class given the trait blueprint. similar to other traits in saveTrait but we reuse this code for updating class dependencies
	getNewClass (trait) {
		let Stat_Requirements = {
			[trait.secondaryStat]: 12,
			[trait.primaryStat]: 14,
		}
		// we use additional abilities instead of abilities because we want all listed, not just 1
		let AdditionalAbilities = []
		if (trait.ability) {
			AdditionalAbilities = trait.ability.split("\n")
		}
		// now we need to create lists of weapons/armor based on user selection
		let Equipment
		let EquipmentSecond
		switch (trait.weapon) {
			case "none":
				Equipment = []
				break
			case "one-melee":
				Equipment = ["Mace (1d6)","Light Hammer (1d4)","Flail (1d8)","Handaxe (1d6)", "War Pick (1d8)", "Javelin (1d6)", "Morningstar (1d8)"]
				break
			case "two-melee":
				Equipment = ["Battleaxe (1d8/1d10)","Greatclub (1d8)","Longsword (1d8/1d10)","Warhammer (1d8/1d10)", "Greataxe (1d12)", "Greatsword (2d6)", "Halberd (1d10)", "Maul (2d6)", "Pike (1d10)"]
				break
			case "finesse-melee":
				Equipment = ["Dagger x2 (1d4 Finesse)", "Shortsword (1d6 Finesse)", "Rapier (1d8 Finesse)", "Scimitar (1d6 Finesse)", "Whip (1d4 Finesse Reach)"]
				break
			case "bows":
				Equipment = ["Shortbow (1d6)","Longbow (1d8)", "Light Crossbow (1d8)", "Heavy Crossbow (1d10)"]
				break
			case "magic":
				Equipment = ["Magic Missile Wand (2) (2x 1d4+1 Auto-hit)", "Alchemist's Fire Guiding Flask (2) (range spell attack, 1d4 per turn until put out (DC 10 DEX action)", "Frost Staff (ranged spell attack, 1d8)", "Staff of Fear (3) (spell save, fear for 2 turns)", "Shocking Wand (ranged spell attack, 3d2)", "Wand of Jitters (ranged spell attack, disarm and knock prone)"]
				break
			case "instrument":
				Equipment = ["Tamborine", "Lute", "Flute", "Pan Flute", "Fiddle", "Recorder", "Ocarina", "Drum", "Bagpipes", "Lyre", "Dulcimer", "Horn", "Shawm", "Viol"]
				break
		}
		switch (trait.armor) {
			case "none":
				EquipmentSecond = ["Silk Robes", "Tunic", "Rags", "Cloak", "Shirtless", "Tight Clothes", "Pelt Coat"]
				break
			case "light":
				EquipmentSecond = ["Leather Armor","Padded Armor","Studded Leather Armor"]
				break
			case "medium":
				EquipmentSecond = ["Scale Mail Armor","Hide Armor","Chain Shirt Armor","Breastplate Armor","Half Plate Armor"]
				break
			case "heavy":
				EquipmentSecond = ["Ring Mail Armor", "Chain Mail Armor", "Splint Armor", "Plate Armor"]
				break
		}
		// if we have a base class, add it as a property and include its default abilities
		let props = []
		let Abilities = []
		if (trait.base) {
			let basedClass = this.getAllClasses().find(x => x.Properties[0] == trait.base)
			Abilities = [...basedClass.Abilities]
			props = [...basedClass.Properties]
			if (basedClass.AdditionalAbilities) {
				AdditionalAbilities = AdditionalAbilities.concat(basedClass.AdditionalAbilities)
			}
		}
		// add the new trait/version
		return {
			Reroll: 0,
			Abilities,
			AdditionalAbilities,
			Name: trait.Name,
			Properties: [trait.id, ...props],
			primaryStat: trait.primaryStat,
			secondaryStat: trait.secondaryStat,
			weapon: trait.weapon,
			armor: trait.armor,
			Equipment,
			EquipmentSecond,
			Stat_Requirements,
			ability: trait.ability,
			id: trait.id,
			base: trait.base,
			hp: trait.hp,
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
		if (this.state.customizePage === "editAbility") {
			this.state.customTraits.abilities.splice(this.state.modifyingTrait, 1)
			page = "abilities"
		}
		if (this.state.customizePage === "editEquipment") {
			this.state.customTraits.equipment.splice(this.state.modifyingTrait, 1)
			page = "equipment"
		}
		if (this.state.customizePage === "editRace") {
			// clear this race on the settings screen if its selected
			let id = this.state.newTrait.id
			if (this.state.settingsNew.Race === id) {
				this.state.settingsNew.Race = "Any"
			}
			this.state.customTraits.races.splice(this.state.modifyingTrait, 1)
			page = "races"
		}
		if (this.state.customizePage === "editClass") {
			// clear this class on the settings screen if its selected
			let id = this.state.newTrait.id
			if (this.state.settingsNew.Class === id) {
				this.state.settingsNew.Class = "Any"
			}
			this.state.customTraits.classes.splice(this.state.modifyingTrait, 1)
			page = "classes"
		}
		let traitsClone = {
			...this.state.customTraits
		}
		//go back in modal
		this.setState({customizePage: page, newTrait: {}, modifyingTrait: -1, customTraits: traitsClone})
	}

	tryToDeleteClass () {
		// no dependents, go ahead
		let dependents = this.getDependents(this.state.newTrait.id)
		if (dependents.length === 0) return true
		else {
			Alert.alert(
				"Delete base class",
				"Other classes are based on this class. Are you sure you want to delete it?",
				[
					{ text: "Yes", onPress: () => {
						// go through all dependents and make them based on no class
						for (let clas of dependents) {
							this.updateClassBase(clas, "")
						}
						// delete the class
						this.deleteTrait()

					}},
					{ text: "No", onPress: () => {}}
				],
				{ cancelable: false }
			);
		}
	}

	updateClassBase (clas, newBase) {
		// strip the class down so we can rebuild its
		let classBlueprint = this.getClassAsNewTrait(clas)
		if (newBase !== undefined) classBlueprint.base = newBase
		// rebuild it, updating the base (new or not) in the proces
		let updatedClass = this.getNewClass(classBlueprint)
		// save the class in-place in our classes array
		for (let index in this.state.customTraits.classes) {
			let clas = this.state.customTraits.classes[index]
			if (clas.id == updatedClass.id) {
				// yes this is the improper way to set state, but its ok here since nothing in the UI needs updating in response to this (because our sub-menus don't render until they're clicked)
				this.state.customTraits.classes[index] = updatedClass
			}
		}
		// repeat this for our dependents
		for (let clas of this.getDependents(updatedClass.id)) {
			this.updateClassBase(clas)
		}
	}

	editTrait (item, index) {
		// remember index so we can update it
		this.setState({modifyingTrait: index})
		// convert generator-usable trait into editable trait
		if (this.state.customizePage === 'personalities') {
			this.setState({
				validate: true,
				newTrait: {
					Name: item.Name,
					id: item.id,
				},
				customizePage: "editPersonality"
			})
		}
		if (this.state.customizePage === 'appearences') {
			this.setState({
				validate: true,
				newTrait: {
					Name: item.Name,
					id: item.id,
				},
				customizePage: "editAppearence"
			})
		}
		if (this.state.customizePage === 'accents') {
			this.setState({
				validate: true,
				newTrait: {
					Name: item,
					id: item.id,
				},
				customizePage: "editAccent"
			})
		}
		if (this.state.customizePage === 'abilities') {
			let desc = ""
			if (item.Description.length > item.Name.length) {
				desc = item.Description.substr(item.Name.length + 2)
			}
			this.setState({
				validate: true,
				newTrait: {
					Name: item.Name,
					description: desc,
					classReq: item.Requirements.Properties,
					levelReq: item.Requirements.Level,
					id: item.id,
				},
				customizePage: "editAbility"
			})
		}
		if (this.state.customizePage === 'equipment') {
			let desc = ""
			if (item.Description.length > item.Name.length) {
				desc = item.Description.substr(item.Name.length + 2)
			}
			this.setState({
				validate: true,
				newTrait: {
					Name: item.Name,
					description: desc,
					classReq: item.Requirements.Properties,
					levelReq: item.Requirements.Level,
					id: item.id,
				},
				customizePage: "editEquipment"
			})
		}
		if (this.state.customizePage === 'races') {
			this.setState({
				validate: true,
				newTrait: {
					Name: item.Name,
					ability: item.Abilities.join('\n'),
					primaryStat: item.primaryStat,
					secondaryStat: item.secondaryStat,
					id: item.id,
				},
				customizePage: "editRace"
			})
		}
		if (this.state.customizePage === 'classes') {
			this.setState({
				validate: true,
				newTrait: this.getClassAsNewTrait(item),
				customizePage: "editClass"
			})
		}
	}

	getClassAsNewTrait (item) {
		return {
			Name: item.Name,
			ability: item.ability,
			primaryStat: item.primaryStat,
			secondaryStat: item.secondaryStat,
			weapon: item.weapon,
			armor: item.armor,
			base: item.base,
			id: item.id,
			hp: item.hp,
		}
	}

	setClassDefaults (baseId) {
		let baseClass = this.getAllClasses().find(x => x.Properties[0] == baseId)
		console.log(baseClass)
		let trait = {...this.state.newTrait}
		if (!trait.hp) {
			if (baseClass.hp) trait.hp = baseClass.hp
			else {
				if (baseClass.Properties.includes("wizard")) trait.hp = "d6"
				if (baseClass.Properties.includes("sorcerer")) trait.hp = "d6"
				if (baseClass.Properties.includes("bard")) trait.hp = "d8"
				if (baseClass.Properties.includes("cleric")) trait.hp = "d8"
				if (baseClass.Properties.includes("druid")) trait.hp = "d8"
				if (baseClass.Properties.includes("warlock")) trait.hp = "d8"
				if (baseClass.Properties.includes("monk")) trait.hp = "d8"
				if (baseClass.Properties.includes("artificer")) trait.hp = "d8"
				if (baseClass.Properties.includes("rogue")) trait.hp = "d8"
				if (baseClass.Properties.includes("ranger")) trait.hp = "d10"
				if (baseClass.Properties.includes("fighter")) trait.hp = "d10"
				if (baseClass.Properties.includes("paladin")) trait.hp = "d10"
				if (baseClass.Properties.includes("barbarian")) trait.hp = "d12"
			}
		}
		if (!trait.armor) {
			if (baseClass.armor) trait.armor = baseClass.armor
			else {
				if (baseClass.Properties.includes("wizard")) trait.armor = "none"
				if (baseClass.Properties.includes("sorcerer")) trait.armor = "none"
				if (baseClass.Properties.includes("bard")) trait.armor = "light"
				if (baseClass.Properties.includes("cleric")) trait.armor = "medium"
				if (baseClass.Properties.includes("druid")) trait.armor = "light"
				if (baseClass.Properties.includes("warlock")) trait.armor = "light"
				if (baseClass.Properties.includes("monk")) trait.armor = "none"
				if (baseClass.Properties.includes("artificer")) trait.armor = "light"
				if (baseClass.Properties.includes("rogue")) trait.armor = "light"
				if (baseClass.Properties.includes("ranger")) trait.armor = "medium"
				if (baseClass.Properties.includes("fighter")) trait.armor = "heavy"
				if (baseClass.Properties.includes("paladin")) trait.armor = "heavy"
				if (baseClass.Properties.includes("barbarian")) trait.armor = "none"
			}
		}
		if (!trait.weapon) {
			if (baseClass.weapon) trait.weapon = baseClass.weapon
			else {
				if (baseClass.Properties.includes("wizard")) trait.weapon = "magic"
				if (baseClass.Properties.includes("sorcerer")) trait.weapon = "magic"
				if (baseClass.Properties.includes("bard")) trait.weapon = "instrument"
				if (baseClass.Properties.includes("cleric")) trait.weapon = "one-melee"
				if (baseClass.Properties.includes("druid")) trait.weapon = "bows"
				if (baseClass.Properties.includes("warlock")) trait.weapon = "one-melee"
				if (baseClass.Properties.includes("monk")) trait.weapon = "none"
				if (baseClass.Properties.includes("artificer")) trait.weapon = "magic"
				if (baseClass.Properties.includes("rogue")) trait.weapon = "finesse-melee"
				if (baseClass.Properties.includes("ranger")) trait.weapon = "bows"
				if (baseClass.Properties.includes("fighter")) trait.weapon = "two-melee"
				if (baseClass.Properties.includes("paladin")) trait.weapon = "two-melee"
				if (baseClass.Properties.includes("barbarian")) trait.weapon = "two-melee"
			}
		}
		if (!trait.primaryStat) {
			if (baseClass.weapon) trait.primaryStat = baseClass.primaryStat
			else {
				if (baseClass.Properties.includes("wizard")) trait.primaryStat = "I"
				if (baseClass.Properties.includes("sorcerer")) trait.primaryStat = "C"
				if (baseClass.Properties.includes("bard")) trait.primaryStat = "C"
				if (baseClass.Properties.includes("cleric")) trait.primaryStat = "W"
				if (baseClass.Properties.includes("druid")) trait.primaryStat = "W"
				if (baseClass.Properties.includes("warlock")) trait.primaryStat = "C"
				if (baseClass.Properties.includes("monk")) trait.primaryStat = "D"
				if (baseClass.Properties.includes("artificer")) trait.primaryStat = "I"
				if (baseClass.Properties.includes("rogue")) trait.primaryStat = "D"
				if (baseClass.Properties.includes("ranger")) trait.primaryStat = "D"
				if (baseClass.Properties.includes("fighter")) trait.primaryStat = "S"
				if (baseClass.Properties.includes("paladin")) trait.primaryStat = "S"
				if (baseClass.Properties.includes("barbarian")) trait.primaryStat = "S"
			}
		}
		if (!trait.secondaryStat) {
			if (baseClass.weapon) trait.secondaryStat = baseClass.secondaryStat
			else {
				if (baseClass.Properties.includes("wizard")) trait.secondaryStat = "W"
				if (baseClass.Properties.includes("sorcerer")) trait.secondaryStat = "E"
				if (baseClass.Properties.includes("bard")) trait.secondaryStat = "D"
				if (baseClass.Properties.includes("cleric")) trait.secondaryStat = "S"
				if (baseClass.Properties.includes("druid")) trait.secondaryStat = "I"
				if (baseClass.Properties.includes("warlock")) trait.secondaryStat = "S"
				if (baseClass.Properties.includes("monk")) trait.secondaryStat = "W"
				if (baseClass.Properties.includes("artificer")) trait.secondaryStat = "E"
				if (baseClass.Properties.includes("rogue")) trait.secondaryStat = "I"
				if (baseClass.Properties.includes("ranger")) trait.secondaryStat = "W"
				if (baseClass.Properties.includes("fighter")) trait.secondaryStat = "E"
				if (baseClass.Properties.includes("paladin")) trait.secondaryStat = "C"
				if (baseClass.Properties.includes("barbarian")) trait.secondaryStat = "E"
			}
		}
		console.log(trait)
		this.setState({newTrait: trait})
	}

	getAllClasses () {
		let classes = this.state.customTraits.classes.concat(require('./src/Class.js').placeholder)
		classes = classes.filter(x => x.Name !== "None")
		return classes
	}

	getIntroText () {
		if (this.state.introStep === 0) return "Click here to create a new NPC"
		if (this.state.introStep === 1) return "Click here to select an NPC. This does nothing right now, but normally you see NPC data here where this text is, which you can tap to edit."
		if (this.state.introStep === 2) return "Click here to delete the currently selected NPC"
		if (this.state.introStep === 3) return "Clicking here allows you to adjust new NPC settings."
		if (this.state.introStep === 4) return "Clicking here allows you to add your own content! Create classes, personalities, equipment, etc which will be used when generating new NPCs!"
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

		customizeTextInputLarge: {
			width: '100%', 
			height: '100%',
			fontSize: 16,
			color: '#ffffff',
			textAlignVertical: 'top'
		},

		customizeTextInputLargeFrame: {
			width: '100%', 
			height: 80,
			fontSize: 16,
			borderWidth: 1,
			borderColor: '#ffffff',
			paddingLeft: 5,
			paddingRight: 5,
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
			marginTop: -7,
			height: 40,
			color: '#ffffff',
			transform: [
				{ scaleX: 1.25 }, 
				{ scaleY: 1.25 },
			]
		},
		
		modalSettingPickerMed: {
			width: 100,
			margin: 0,
			padding: 0,
			marginTop: -7,
			height: 40,
			color: '#ffffff',
			transform: [
				{ scaleX: 1.25 }, 
				{ scaleY: 1.25 },
			],
		},
		
		modalSettingPickerThin: {
			width: 80,
			margin: 0,
			padding: 0,
			marginTop: -7,
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

		multiSelectSearch: {
			display: 'none'
		},

		redOutline: {
			borderWidth: 2,
			borderColor: '#a21414',
		},

		transOutline: {
			margin: 2,
		},

		overlay: {
			position: 'absolute',
			width: '100%',
			height: '100%', 
			opacity: 0.8,
			backgroundColor: 'black',
			zIndex: 10
		},

		overOverlay: {
			zIndex: 100
		},

		introText: {
			color: '#ffffff',
			fontSize: 30,
			padding: 20,
		}
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
