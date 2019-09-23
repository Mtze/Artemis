import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Exercise, ExerciseType, ParticipationStatus } from 'app/entities/exercise';
import { QuizExercise } from 'app/entities/quiz-exercise';
import { InitializationState, Participation, ProgrammingExerciseStudentParticipation } from 'app/entities/participation';
import * as moment from 'moment';
import { CourseExerciseService } from 'app/entities/course';
import { Router } from '@angular/router';
import { JhiAlertService } from 'ng-jhipster';
import { ProgrammingExercise } from 'app/entities/programming-exercise';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core';
import { SourceTreeService } from 'app/components/util/sourceTree.service';
import { GuidedTourService } from 'app/guided-tour/guided-tour.service';
import { cloneRepositoryTour, courseExerciseOverviewTour } from 'app/guided-tour/tours/course-exercise-overview-tour';

@Component({
    selector: 'jhi-exercise-details-student-actions',
    templateUrl: './exercise-details-student-actions.component.html',
    styleUrls: ['../course-overview.scss'],
    providers: [JhiAlertService, SourceTreeService],
})
export class ExerciseDetailsStudentActionsComponent implements OnInit {
    readonly QUIZ = ExerciseType.QUIZ;
    readonly PROGRAMMING = ExerciseType.PROGRAMMING;
    readonly MODELING = ExerciseType.MODELING;
    readonly TEXT = ExerciseType.TEXT;
    readonly FILE_UPLOAD = ExerciseType.FILE_UPLOAD;
    readonly QUIZ_UNINITIALIZED = ParticipationStatus.QUIZ_UNINITIALIZED;
    readonly QUIZ_ACTIVE = ParticipationStatus.QUIZ_ACTIVE;
    readonly QUIZ_SUBMITTED = ParticipationStatus.QUIZ_SUBMITTED;
    readonly QUIZ_NOT_STARTED = ParticipationStatus.QUIZ_NOT_STARTED;
    readonly QUIZ_NOT_PARTICIPATED = ParticipationStatus.QUIZ_NOT_PARTICIPATED;
    readonly QUIZ_FINISHED = ParticipationStatus.QUIZ_FINISHED;
    readonly MODELING_EXERCISE = ParticipationStatus.MODELING_EXERCISE;
    readonly TEXT_EXERCISE = ParticipationStatus.TEXT_EXERCISE;
    readonly FILE_UPLOAD_EXERCISE = ParticipationStatus.FILE_UPLOAD_EXERCISE;
    readonly UNINITIALIZED = ParticipationStatus.UNINITIALIZED;
    readonly INITIALIZED = ParticipationStatus.INITIALIZED;
    readonly INACTIVE = ParticipationStatus.INACTIVE;

    @Input() @HostBinding('class.col') equalColumns = true;
    @Input() @HostBinding('class.col-auto') smallColumns = false;

    @Input() exercise: Exercise;
    @Input() courseId: number;

    @Input() actionsOnly: boolean;
    @Input() smallButtons: boolean;
    @Input() showResult: boolean;

    public repositoryPassword: string;
    public wasCopied = false;

    constructor(
        private jhiAlertService: JhiAlertService,
        private courseExerciseService: CourseExerciseService,
        private httpClient: HttpClient,
        private accountService: AccountService,
        private sourceTreeService: SourceTreeService,
        private router: Router,
        private guidedTourService: GuidedTourService,
    ) {}

    ngOnInit(): void {
        this.accountService.identity().then(user => {
            // Only load password if current user login starts with 'edx_' or 'u4i_'
            if (user && user.login && (user.login.startsWith('edx_') || user.login.startsWith('u4i_'))) {
                this.getRepositoryPassword();
            }
        });
    }

    participationStatus(): ParticipationStatus {
        if (this.exercise.type === ExerciseType.QUIZ) {
            const quizExercise = this.exercise as QuizExercise;
            if ((!quizExercise.isPlannedToStart || moment(quizExercise.releaseDate!).isAfter(moment())) && quizExercise.visibleToStudents) {
                return ParticipationStatus.QUIZ_NOT_STARTED;
            } else if (
                !this.hasParticipations(this.exercise) &&
                (!quizExercise.isPlannedToStart || moment(quizExercise.dueDate!).isAfter(moment())) &&
                quizExercise.visibleToStudents
            ) {
                return ParticipationStatus.QUIZ_UNINITIALIZED;
            } else if (!this.hasParticipations(this.exercise)) {
                return ParticipationStatus.QUIZ_NOT_PARTICIPATED;
            } else if (this.exercise.studentParticipations[0].initializationState === InitializationState.INITIALIZED && moment(this.exercise.dueDate!).isAfter(moment())) {
                return ParticipationStatus.QUIZ_ACTIVE;
            } else if (this.exercise.studentParticipations[0].initializationState === InitializationState.FINISHED && moment(this.exercise.dueDate!).isAfter(moment())) {
                return ParticipationStatus.QUIZ_SUBMITTED;
            } else {
                if (!this.hasResults(this.exercise.studentParticipations[0])) {
                    return ParticipationStatus.QUIZ_NOT_PARTICIPATED;
                }
                return ParticipationStatus.QUIZ_FINISHED;
            }
        } else if (
            (this.exercise.type === ExerciseType.MODELING || this.exercise.type === ExerciseType.TEXT || this.exercise.type === ExerciseType.FILE_UPLOAD) &&
            this.hasParticipations(this.exercise)
        ) {
            const participation = this.exercise.studentParticipations[0];
            if (participation.initializationState === InitializationState.INITIALIZED || participation.initializationState === InitializationState.FINISHED) {
                switch (this.exercise.type) {
                    case ExerciseType.MODELING:
                        return ParticipationStatus.MODELING_EXERCISE;
                    case ExerciseType.TEXT:
                        return ParticipationStatus.TEXT_EXERCISE;
                    case ExerciseType.FILE_UPLOAD:
                        return ParticipationStatus.FILE_UPLOAD_EXERCISE;
                }
            }
        }

        if (!this.hasParticipations(this.exercise)) {
            return ParticipationStatus.UNINITIALIZED;
        } else if (this.exercise.studentParticipations[0].initializationState === InitializationState.INITIALIZED) {
            return ParticipationStatus.INITIALIZED;
        }
        return ParticipationStatus.INACTIVE;
    }

    hasParticipations(exercise: Exercise): boolean {
        return exercise.studentParticipations && exercise.studentParticipations.length > 0;
    }

    hasResults(participation: Participation): boolean {
        return participation.results && participation.results.length > 0;
    }

    repositoryUrl(participation: Participation) {
        return (participation as ProgrammingExerciseStudentParticipation).repositoryUrl;
    }

    isPracticeModeAvailable(): boolean {
        const quizExercise = this.exercise as QuizExercise;
        return quizExercise.isPlannedToStart && quizExercise.isOpenForPractice && moment(quizExercise.dueDate!).isBefore(moment());
    }

    isOnlineEditorAllowed(): boolean {
        return (this.exercise as ProgrammingExercise).allowOnlineEditor;
    }

    publishBuildPlanUrl(): boolean {
        return (this.exercise as ProgrammingExercise).publishBuildPlanUrl;
    }

    onCopyFailure() {
        console.log('copy fail!');
    }

    onCopySuccess() {
        this.wasCopied = true;
        setTimeout(() => {
            this.wasCopied = false;
        }, 3000);
    }

    startExercise() {
        this.exercise.loading = true;

        if (this.exercise.type === ExerciseType.QUIZ) {
            // Start the quiz
            return this.router.navigate(['/quiz', this.exercise.id]);
        }

        this.courseExerciseService
            .startExercise(this.courseId, this.exercise.id)
            .finally(() => (this.exercise.loading = false))
            .subscribe(
                participation => {
                    if (participation) {
                        this.exercise.studentParticipations = [participation];
                        this.exercise.participationStatus = this.participationStatus();
                    }
                    if (this.exercise.type === ExerciseType.PROGRAMMING) {
                        this.jhiAlertService.success('artemisApp.exercise.personalRepository');
                        this.startCloneRepositoryGuidedTour();
                    }
                },
                error => {
                    console.log('Error: ' + error);
                    this.jhiAlertService.warning('artemisApp.exercise.startError');
                },
            );
    }

    buildSourceTreeUrl(cloneUrl: string): string {
        return this.sourceTreeService.buildSourceTreeUrl(cloneUrl);
    }

    resumeProgrammingExercise() {
        this.exercise.loading = true;
        this.courseExerciseService
            .resumeProgrammingExercise(this.courseId, this.exercise.id)
            .finally(() => (this.exercise.loading = false))
            .subscribe(
                participation => {
                    if (participation) {
                        this.exercise.studentParticipations = [participation];
                        this.exercise.participationStatus = this.participationStatus();
                    }
                },
                error => {
                    console.log('Error: ' + error.status + ' ' + error.message);
                    this.jhiAlertService.error(`artemisApp.${error.error.entityName}.errors.${error.error.errorKey}`);
                },
            );
    }

    startPractice() {
        return this.router.navigate(['/quiz', this.exercise.id, 'practice']);
    }

    getRepositoryPassword() {
        this.sourceTreeService.getRepositoryPassword().subscribe(res => {
            const password = res['password'];
            if (password) {
                this.repositoryPassword = password;
            }
        });
    }

    /**
     * Start the clone repository guided tour if the user has not viewed and finished the tour yet
     */
    startCloneRepositoryGuidedTour() {
        if (this.guidedTourService.checkTourStateFinished(courseExerciseOverviewTour)) {
            this.guidedTourService.enableTour(cloneRepositoryTour);
            // Set timeout for clone repository button to render
            setTimeout(() => {
                this.guidedTourService.startTour();
            }, 1000);
        }
    }
}
