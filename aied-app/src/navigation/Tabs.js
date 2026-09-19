import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import VideoPlayer from '../screens/VideoPlayer/VideoPlayer';
import DoubtSolver from '../screens/DoubtSolver/DoubtSolver';
import Dashboard from '../screens/Dashboard/Dashboard';
import MockTest from '../screens/MockTest/MockTest';
import PYQAnalysis from '../screens/PYQAnalysis/PYQAnalysis';
import CareerChatbot from '../screens/CareerChatbot/CareerChatbot';

const Tab = createBottomTabNavigator();
export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#4338CA', headerTitleStyle: { fontWeight: '800' } }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Watch" component={VideoPlayer} />
      <Tab.Screen name="Doubts" component={DoubtSolver} />
      <Tab.Screen name="Progress" component={Dashboard} />
      <Tab.Screen name="Test" component={MockTest} />
      <Tab.Screen name="Papers" component={PYQAnalysis} />
      <Tab.Screen name="Career" component={CareerChatbot} />
    </Tab.Navigator>
  );
}
