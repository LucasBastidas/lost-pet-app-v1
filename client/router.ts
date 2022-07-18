import { Router } from "@vaadin/router";
const router = new Router(document.querySelector(".root"));
router.setRoutes([
	{ path: "/", component: "x-home-page" },
	{ path: "/log-in-1", component: "x-log-in-1-page" },
	{ path: "/log-in-2", component: "x-log-in-2-page" },
	{ path: "/sign-up", component: "x-sign-up-page" },
	{ path: "/my-data", component: "x-my-data-page" },
	{ path: "/my-reported-pets", component: "x-my-reported-pets-page" },
	{ path: "/report-pet", component: "x-report-pet-page" },
	{ path: "/task-completed", component: "x-task-completed-page" },
]);
