//
// Created by Adrian on 14/01/2024.
//

#ifndef MYAPP_TASK_H
#define MYAPP_TASK_H
#include <fstream>
#include <utility>
using namespace std;

struct Task {
    int id;
    string taskName;
    string date;
    string startTime;
    string endTime;
    string comment;

    Task(int id, string taskName, string date, string startTime, string endTime, string comment){
        this->id = id;
        this->taskName = std::move(taskName);
        this->date = std::move(date);
        this->startTime = std::move(startTime);
        this->endTime = std::move(endTime);
        this->comment = std::move(comment);
    }
};
typedef struct Task Task;

#endif //MYAPP_TASK_H
