import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
	const [task, setTask] = useState('');
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		const loadTasks = async () => {
			try {
				const storedTasks = await AsyncStorage.getItem('tasks');
				if (storedTasks) {
					setTasks(JSON.parse(storedTasks));
				}
			} catch (error) {
				console.error(error);
			}
		};
		loadTasks();
	}, []);

	const addTask = async () => {
		if (task.trim()) {
			const newTasks = [
				...tasks,
				{ id: Date.now().toString(), text: task.trim() },
			];
			setTasks(newTasks);
			setTask('');
			try {
				await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
			} catch (error) {
				console.error(error);
			}
		}
	};

	const deleteTask = async (id) => {
		const filteredTasks = tasks.filter((item) => item.id !== id);
		setTasks(filteredTasks);
		try {
			await AsyncStorage.setItem('tasks', JSON.stringify(filteredTasks));
		} catch (error) {
			console.error(error);
		}
	};

	const renderItem = ({ item }) => (
		<View style={styles.taskItem}>
			<Text>{item.text}</Text>
			<TouchableOpacity
				onPress={() => deleteTask(item.id)}
				style={styles.deleteButton}
			>
				<Text style={styles.deleteText}>Excluir</Text>
			</TouchableOpacity>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Gerenciador de Tarefas</Text>
			<TextInput
				style={styles.input}
				placeholder='Digite uma tarefa'
				value={task}
				onChangeText={setTask}
			/>
			<Button title='Adicionar Tarefa' onPress={addTask} />
			<FlatList
				data={tasks}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		backgroundColor: '#fff',
	},
	taskItem: {
		padding: 10,
		marginBottom: 5,
		backgroundColor: '#e0e0e0',
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	deleteButton: {
		backgroundColor: '#ff5c5c',
		padding: 5,
		borderRadius: 5,
	},
	deleteText: {
		color: '#fff',
		fontWeight: 'bold',
	},
});
