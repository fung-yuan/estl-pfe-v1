import Dashboard from './pages/Dashboard';
import AttendanceManagement from './pages/AttendanceManagement';
import StudentManagement from './pages/StudentManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import Reports from './pages/Reports';
import SubjectManagement from './pages/SubjectManagement';
import SendEmailAnnouncementPage from './pages/SendEmailAnnouncementPage';

import {
  Home,
  ClipboardCheck as ClipboardDocumentList,
  Users as UserGroup,
  Building2 as BuildingOffice,
  BarChart as ChartBar,
  BookOpen,
  Bell,
  MessagesSquare,
  Mail
} from 'lucide-react'; // Import the icons

export const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    icon: 'Home'
  },

  {
    path: '/send-email-announcement',
    name: 'Send Email',
    component: SendEmailAnnouncementPage,
    icon: 'Mail'
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: AttendanceManagement,
    icon: 'ClipboardCheck'
  },
  {
    path: '/students',
    name: 'Students',
    component: StudentManagement,
    icon: 'Users'
  },
  {
    path: '/departments',
    name: 'Departments',
    component: DepartmentManagement,
    icon: 'Building2'
  },
  {
    path: '/subjects',
    name: 'Subjects',
    component: SubjectManagement,
    icon: 'BookOpen'
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    icon: 'BarChart'
  },
];