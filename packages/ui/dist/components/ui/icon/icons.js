import { PlaneTakeoff, GraduationCap, Gamepad2, Briefcase, Heart, Home, Tag, Rocket, PartyPopper, Star, PawPrint, Car, Utensils, Dumbbell, Hospital, Landmark, Lightbulb, Zap, Flower2, Mountain, Feather, Calendar, Hourglass, StopCircle, Pencil, TrendingUp, CalendarDays, Timer, Radar, Infinity, Wallet, Clock, Plus, X, CalendarRange, ArrowRight, Info, PlayCircle, CalendarClock, HelpCircle, History, Settings, Trash, BookOpen, Check, UserCog } from 'lucide-svelte';
export var IconType;
(function (IconType) {
    IconType["DELETE"] = "delete";
    IconType["SETTINGS"] = "settings";
    IconType["FLIGHT_TAKEOFF"] = "flight_takeoff";
    IconType["SCHOOL"] = "school";
    IconType["TOYS"] = "toys";
    IconType["WORK"] = "work";
    IconType["FAVORITE"] = "favorite";
    IconType["HOME"] = "home";
    IconType["LABEL"] = "label";
    IconType["ROCKET_LAUNCH"] = "rocket_launch";
    IconType["CELEBRATION"] = "celebration";
    IconType["STAR"] = "star";
    IconType["PETS"] = "pets";
    IconType["DIRECTIONS_CAR"] = "directions_car";
    IconType["RESTAURANT"] = "restaurant";
    IconType["FITNESS_CENTER"] = "fitness_center";
    IconType["LOCAL_HOSPITAL"] = "local_hospital";
    IconType["ACCOUNT_BALANCE"] = "account_balance";
    IconType["LIGHTBULB"] = "lightbulb";
    IconType["BOLT"] = "bolt";
    IconType["SPA"] = "spa";
    IconType["HIKING"] = "hiking";
    IconType["HISTORY_EDU"] = "history_edu";
    IconType["CALENDAR_MONTH"] = "calendar_month";
    IconType["TIMELAPSE"] = "timelapse";
    IconType["STOP_CIRCLE"] = "stop_circle";
    IconType["EDIT"] = "edit";
    IconType["INSIGHTS"] = "insights";
    IconType["CALENDAR_VIEW_WEEK"] = "calendar_view_week";
    IconType["TIMER"] = "timer";
    IconType["TRACK_CHANGES"] = "track_changes";
    IconType["ALL_INCLUSIVE"] = "all_inclusive";
    IconType["ACCOUNT_BALANCE_WALLET"] = "account_balance_wallet";
    IconType["SCHEDULE"] = "schedule";
    IconType["ADD"] = "add";
    IconType["CLOSE"] = "close";
    IconType["DATE_RANGE"] = "date_range";
    IconType["SELL"] = "sell";
    IconType["ARROW_RIGHT_ALT"] = "arrow_right_alt";
    IconType["INFO"] = "info";
    IconType["ARROW_FORWARD"] = "arrow_forward";
    IconType["PLAY_CIRCLE"] = "play_circle";
    IconType["CALENDAR_CLOCK"] = "calendar_clock";
    IconType["HELP"] = "help";
    IconType["HISTORY"] = "history";
    IconType["CHILDHOOD"] = "childhood";
    IconType["VACATION"] = "vacation";
    IconType["EDUCATION"] = "education";
    IconType["CAREER"] = "career";
    IconType["HEALTH"] = "health";
    IconType["FAMILY"] = "family";
    IconType["STARS"] = "stars";
    IconType["BOOK_OPEN"] = "book_open";
    IconType["CHECK"] = "check";
    IconType["USER_COG"] = "user_cog";
})(IconType || (IconType = {}));
export const iconMap = {
    'delete': Trash,
    'settings': Settings,
    'flight_takeoff': PlaneTakeoff,
    'school': GraduationCap,
    'toys': Gamepad2,
    'work': Briefcase,
    'favorite': Heart,
    'home': Home,
    'label': Tag,
    'rocket_launch': Rocket,
    'celebration': PartyPopper,
    'star': Star,
    'pets': PawPrint,
    'directions_car': Car,
    'restaurant': Utensils,
    'fitness_center': Dumbbell,
    'local_hospital': Hospital,
    'account_balance': Landmark,
    'lightbulb': Lightbulb,
    'bolt': Zap,
    'spa': Flower2,
    'hiking': Mountain,
    'history_edu': Feather,
    'calendar_month': Calendar,
    'timelapse': Hourglass,
    'stop_circle': StopCircle,
    'edit': Pencil,
    'insights': TrendingUp,
    'calendar_view_week': CalendarDays,
    'timer': Timer,
    'track_changes': Radar,
    'all_inclusive': Infinity,
    'account_balance_wallet': Wallet,
    'schedule': Clock,
    'add': Plus,
    'close': X,
    'date_range': CalendarRange,
    'sell': Tag,
    'arrow_right_alt': ArrowRight,
    'info': Info,
    'arrow_forward': ArrowRight,
    'play_circle': PlayCircle,
    'calendar_clock': CalendarClock,
    'help': HelpCircle,
    'history': History,
    'childhood': Gamepad2,
    'vacation': PlaneTakeoff,
    'education': GraduationCap,
    'career': Briefcase,
    'health': Heart,
    'family': Home,
    'stars': Star,
    'book_open': BookOpen,
    'check': Check,
    'user_cog': UserCog
};
export const availableIcons = Object.keys(iconMap);
