import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(
                    `http://localhost:5000/chat?activityId=${activityId}`,
                    {
                        accessTokenFactory: () => store.userStore.user?.token!,
                    }
                )
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection
                .start()
                .catch((err) =>
                    console.error(
                        "Error stablishing connection: ",
                        err.toString()
                    )
                );

            this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment);
                });
            });

            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
                runInAction(() => {
                    comments.forEach((comment) => {
                        comment.createdAt = new Date(comment.createdAt + "Z");
                        //add z in end  to fix datetime that recieve from ef core
                    });
                    this.comments = comments;
                });
            });
        }
    };

    stopHubConnection = () => {
        if (this.hubConnection) {
            this.hubConnection.stop().catch((err) => {
                console.error(err);
            });
        }
    };

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    };

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke("SendComment", values);
        } catch (error) {
            console.log(error);
        }
    };
}
